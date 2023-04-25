import React from 'react';
import {
	ActivityIndicator,
	Button,
	Clipboard,
	FlatList,
	Image,
	Share,
	StyleSheet,
	ScrollView,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity
} from 'react-native';
import TextView from "core/TextView";
import * as ImagePicker from 'expo-image-picker';
import { nanoid } from "nanoid/non-secure";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// firebase app default
import firebase from "./../../../../../common/firebase";
// config
import { getConfig } from "./../../../../../common/AppConfig";

// Create a root reference
const storage = getStorage();

const google = getConfig("google");

export default class BulkUpload extends React.Component {
	state = {
		image: null,
		uploading: false,
		googleResponse: null,
		headerMapped: false
	};

	async componentDidMount() {
		
	}

	render() {
		let { image, googleResponse, headerMapped } = this.state;
		return (
			<View style={styles.container}>
				<ScrollView
					style={styles.container}
					contentContainerStyle={styles.contentContainer}
				>
					{
						image && !googleResponse ? (
							this._maybeRenderImage()
						): !googleResponse ? (
							<View style={styles.helpContainer}>
								<TouchableOpacity
									onPress={this._pickImage}
									style = {{
										width: "80%",
										height: 50,
										backgroundColor: "#20BC9B",
										borderRadius: 40,
										justifyContent: "center",
										alignItems: "center"
									}}
								>
									<TextView style = {{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
										Pick An Image
									</TextView>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={this._takePhoto}
									style = {{
										marginTop: 14,
										width: "80%",
										height: 50,
										borderColor: "#20BC9B",
										borderWidth: 1,
										borderRadius: 40,
										justifyContent: "center",
										alignItems: "center"
									}}
								>
									<TextView style = {{ color: "#20BC9B", fontSize: 18, fontWeight: "bold" }}>
										Take a photo
									</TextView>
								</TouchableOpacity>
								
								{/* {this.state.googleResponse && (
									<FlatList
										data={this.state.googleResponse.responses[0].labelAnnotations}
										extraData={this.state}
										keyExtractor={this._keyExtractor}
										renderItem={({ item }) => <TextView>Item: {item.description}</TextView>}
									/>
								)} */}
							</View>
						): null
					}
					{
						// googleResponse && !headerMapped ? (
						// 	<View>

						// 	</View>
						// ): null
					}
					{
						googleResponse ? (
							<View>
								{
									googleResponse.map((row) => (
										<TextView>
											{ JSON.stringify(row) }
										</TextView>
									))
								}
							</View>
						) : null
					}
					{this._maybeRenderUploadingOverlay()}
				</ScrollView>
			</View>
		);
	}

	organize = array => {
		return array.map(function(item, i) {
			return (
				<View key={i}>
					<TextView>{item}</TextView>
				</View>
			);
		});
	};

	_maybeRenderUploadingOverlay = () => {
		if (this.state.uploading) {
			return (
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: 'rgba(0,0,0,0.4)',
							alignItems: 'center',
							justifyContent: 'center'
						}
					]}
				>
					<ActivityIndicator color="#fff" animating size="large" />
				</View>
			);
		}
	};

	_maybeRenderImage = () => {
		let { image, googleResponse } = this.state;
		if (!image) {
			return;
		}

		return (
			<View
				style={{
                    flex: 1,
					// marginTop: 20,
					width: "100%",
					justifyContent: "center",
					alignItems: "center"
					// borderRadius: 3,
					// elevation: 2
				}}
			>
				<View
					style={{
                        flex: 1,
						padding: 20,
						// borderTopRightRadius: 3,
						// borderTopLeftRadius: 3,
						// shadowColor: 'rgba(0,0,0,1)',
						// shadowOpacity: 0.2,
						// shadowOffset: { width: 4, height: 4 },
						// shadowRadius: 5,
						overflow: 'hidden'
					}}
				>
					<Image source={{ uri: image }} style={{ width: "100%", resizeMode: 'contain', aspectRatio: 1 }} />
				</View>
				{/* <TextView
					onPress={this._copyToClipboard}
					onLongPress={this._share}
					style={{ paddingVertical: 10, paddingHorizontal: 10 }}
				/> */}

				{/* <TextView>Raw JSON:</TextView>

				{googleResponse && (
					<TextView
						onPress={this._copyToClipboard}
						onLongPress={this._share}
						style={{ paddingVertical: 10, paddingHorizontal: 10 }}
					>
						{JSON.stringify(googleResponse.responses)}
					</TextView>
				)} */}
				<TouchableOpacity
					style = {{
						width: "80%",
						height: 50,
						backgroundColor: "#20BC9B",
						borderRadius: 40,
						justifyContent: "center",
						alignItems: "center"
					}}
					onPress={() => this.submitToGoogle()}
				>
					<TextView style = {{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
						Analyze
					</TextView>
				</TouchableOpacity>
			</View>
		);
	};

	_keyExtractor = (item, index) => item.id;

	_renderItem = item => {
		<TextView>response: {JSON.stringify(item)}</TextView>;
	};

	_share = () => {
		Share.share({
			message: JSON.stringify(this.state.googleResponse.responses),
			title: 'Check it out',
			url: this.state.image
		});
	};

	_copyToClipboard = () => {
		Clipboard.setString(this.state.image);
		alert('Copied to clipboard');
	};

	_takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
			base64: true
		});

		this._handleImagePicked(pickerResult);
	};

	_pickImage = async () => {
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			// aspect: [4, 3],
			base64: true
		});

		this._handleImagePicked(pickerResult);
	};

	_handleImagePicked = async pickerResult => {
		try {
			this.setState({ uploading: true });
			console.log("image =>", pickerResult);

			if (!pickerResult.cancelled) {
				const uploadUrl = await uploadImageAsync(pickerResult.uri);
				this.setState({ image: uploadUrl, imageBase64: pickerResult.base64 });
			}
		} catch (e) {
			console.log(e);
			alert('Upload failed, sorry :(');
		} finally {
			this.setState({ uploading: false });
		}
	};

	submitToGoogle = async () => {
		try {
			this.setState({ uploading: true });
			let { image, imageBase64 } = this.state;
			let body = JSON.stringify({
				requests: [
					{
						features: [
							{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
						],
						image: {
							content: imageBase64
						}
					}
				]
			});
			let response = await fetch(
				'https://vision.googleapis.com/v1/images:annotate?key=' + google.visionApiKey,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: body
				}
			);
			// console.log(body);
			let responseJson = await response.json();

			console.log(JSON.stringify(responseJson));
			if (!responseJson.responses[0].error) {
				const stockData = breakStringIntoRows(responseJson.responses[0].textAnnotations[0].description);
				console.log(stockData);
				this.setState({
					googleResponse: stockData,
					uploading: false
				});
			} else {
				this.setState({
					uploading: false
				}, () => {
					console.log(responseJson);
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
}

function breakStringIntoRows(str, arrLength) {
    const stockData = str.split("\n");
	console.log(str);
    // we'll need to take the number of rows that is being scanned manually
    // hard coding it for now
    const numberOfRows = 10;
    const itemsInEachRow = 8;
    // const itemsInEachRow = Math.ceil(stockData.length/numberOfRows) - 1;
    
    let start = 0;
    let end = itemsInEachRow;

	const arr = [];

    for (let i = 0; i < numberOfRows; i++) {
        arr.push(stockData.slice(start, end));

        start = end;
        end = start + itemsInEachRow;
    }

    return arr;
}

async function uploadImageAsync(uri) {
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function() {
			resolve(xhr.response);
		};
		xhr.onerror = function(e) {
			console.log(e);
			reject(new TypeError('Network request failed'));
		};
		xhr.responseType = 'blob';
		xhr.open('GET', uri, true);
		xhr.send(null);
	});

    const storageRef = ref(storage, nanoid());

    // 'file' comes from the Blob or File API
    const snapshot = await uploadBytes(storageRef, blob);

	// const ref = firebase
	// 	.storage()
	// 	.ref()
	// 	.child(nanoid());
	// const snapshot = await ref.put(blob);

	blob.close();
    return await getDownloadURL(snapshot.ref);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingBottom: 10,
        width: "100%",
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center'
	},
	contentContainer: {
		justifyContent: "center",
		height: "100%"
	},

	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50
	},

	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center'
	},

	helpContainer: {
        display: "flex",
		marginTop: 15,
		alignItems: 'center'
	}
});