export const validateAndParseCustomer = (customer) => {
    return {
        name: validateCustomerName(customer.name),
        phone: validateCustomerPhone(customer.phone),
        email: validateCustomerEmail(customer.email),
        gender: customer.gender === "Select" ? undefined : customer.gender,
        address: customer.address.trim().length === 0 ? undefined : customer.address.trim()
    }
}

export const validateCustomerName = (name) => {
    if (name.trim().length === 0) {
        throw "Invalid input for name field.";
    }

    return name.trim();
}

export const validateCustomerPhone = (phone) => {
    const numReg = /^\d+$/;
    var isNum = numReg.test(phone);

    if(!isNum) {
        throw "Invalid input for phone field."
    }

    return phone.trim();
}

export const validateCustomerEmail = (email) => {
    if (email.trim().length === 0) {
        return undefined;
    }

    if (!checkEmail(email)) {
        throw "Invalid input for email field."
    }

    return email.trim().toLowerCase();
}

export const checkEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}