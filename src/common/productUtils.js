import store from "./../store";
import { updateLocalProduct, updateLocalStock } from "./../actions/productActions";
import { getFormatedDate } from "./utils";

export function parseProduct(product) {
    const isNumber = [
        "availableQuantity",
        "price",
        "cgst",
        "sgst",
        "gst",
        "discount",
        "outOfStockThreshold"
    ];

    const isDate = [
        "expiry",
        "mfg"
    ]

    const obj = {};

    Object.keys(product).map((key) => {
        if (isNumber.includes(key)) {
            obj[key] = parseFloat(product[key]);
        } else if (key === "dimension") {
            const l = product[key].l && typeof product[key].l === "string" && product[key].l.length > 0 ? parseFloat(product[key].l) : product[key].l;
            const b = product[key].b && typeof product[key].b === "string" && product[key].b.length > 0 ? parseFloat(product[key].b) : product[key].b;
            const h = product[key].h && typeof product[key].h === "string" && product[key].h.length > 0 ? parseFloat(product[key].h) : product[key].h;

            obj[key] = {
                l,
                b,
                h
            };
        } else if (key === "weight") {
            if (product[key].value === null) {
                obj[key] = {
                    // ...product[key],
                    // value: undefined
                }
            } else {
                obj[key] = {
                    ...product[key],
                    value: parseFloat(product[key].value)
                }
            }
        } else if (key === "availableUnits") {
            const availableUnits = product[key].map((unit) => {
                return {
                    label: unit.label,
                    cfactor: parseFloat(unit.cfactor),
                    rpu: parseFloat(unit.rpu)
                }
            });
            
            obj[key] = availableUnits;
        } else if (key === "smallestUnit") {
            const unit = product[key];
            obj[key] = {
                label: unit.label,
                cfactor: parseFloat(unit.cfactor),
                rpu: parseFloat(unit.rpu)
            }
        } else if(isDate.includes(key)) {
            const formatedDate = getFormatedDate(product[key]);
            const arr = formatedDate.split("/");

            obj[key] = arr[2]+"/"+arr[1]+"/"+arr[0];
        } else {
            obj[key] = product.hasOwnProperty(key) ? product[key] : undefined;
        }
    })

    return obj;
}

export function validateProduct(product) {

    let isValid = true;
    let message = "Please fill all the mandatory fields!";
    if (!product.name || product.name.length === 0) {
        isValid = false;
        message = "Name is a mandatory fill.";
    } else if (!product.availableQuantity || product.availableQuantity.length === 0) {
        isValid = false;
        message = "Available is a mandatory fill.";
    } else if (!product.cgst || product.cgst.length === 0) {
        isValid = false;
        message = "CGST is a mandatory fill.";
    } else if (!product.sgst || product.sgst.length === 0) {
        isValid = false;
        message = "SGST is a mandatory fill.";
    } else if (!product.availableUnits || product.availableUnits.length === 0) {
        isValid = false;
        message = "You need to create atleast one available Unit. You can label it unit/pack or anything you want.";
    }

    return {
        valid: isValid,
        message
    }
}

export function updateLocalProductList(pid, updatedData) {
    const state = store.getState();
    const { productList } = state.products;
    const updatedProductList = Object.assign([], productList);
    
    for (let i = 0; i < productList.length; i++) {
        if(productList[i].pid === pid) {
            let product = Object.assign({}, productList[i]);
            product = {
                ...product,
                ...updatedData
            }

            updatedProductList[i] = Object.assign({}, product);
        }
    }

    store.dispatch(updateLocalProduct(updatedProductList));
}

export function updateLocalStockList(pid, updatedData) {
    const state = store.getState();
    const { stockList } = state.products;
    const updatedStockList = Object.assign([], stockList);
    
    for (let i = 0; i < stockList.length; i++) {
        if(stockList[i].pid === pid) {
            let product = Object.assign({}, stockList[i]);
            product = {
                ...product,
                ...updatedData
            }

            updatedStockList[i] = Object.assign({}, product);
        }
    }

    store.dispatch(updateLocalStock(updatedStockList));
}
