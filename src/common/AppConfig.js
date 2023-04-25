import * as config from "./../../common/config.json";

export function getConfig(key) {
    return config[key]
}