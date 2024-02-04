export const constants ={
    MAILJS_SERVICE_ID: "service_fr6eqy7",
    MAILJS_TEMPLATE_ID: "template_z9ustqt",
    MAILJS_PUBLIC_KEY: "JX9jRsQr6H1E1BEes",
    ADMIN_PASSWORD: "YOUR_ADMIN_PASSWORD"
}

export function createurl(path){
    return 'http://localhost:9999/api' + path;
}

export function log(message){
    console.log(message);
}