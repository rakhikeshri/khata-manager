import store from "./../store";
import { updateOrderList } from "./../actions/orderAction";

export function appendScannedProducts(product) {
    const state = store.getState();
    const { createBillPayload } = state.orders;
    const productList = Object.assign([], createBillPayload.products);
    productList.push(product);

    createBillPayload.products = Object.assign([], productList);

    return {
        ...createBillPayload,
        products: productList
    }
}

export function deleteProductsFromBill(index) {
    const state = store.getState();
    const { createBillPayload } = state.orders;
    const productList = Object.assign([], createBillPayload.products);
    productList.splice(index, 1);

    createBillPayload.products = Object.assign([], productList);

    return {
        ...createBillPayload,
        products: productList
    }
}

export function appendCustomerPhone(phone, gstin = null) {
    const state = store.getState();
    const { createBillPayload } = state.orders;

    return {
        ...createBillPayload,
        customerPhone: phone,
        gstin: gstin
    }
}

export function appendCustomerGst(gstin = null) {
    const state = store.getState();
    const { createBillPayload } = state.orders;

    return {
        ...createBillPayload,
        gstin: gstin
    }
}

export function appendPaymentDetails(paymentStages, paymentStatus) {
    const state = store.getState();
    const { createBillPayload } = state.orders;
    const stage = paymentStages[0];
    const paymentMethod = stage.method;
    const paymentRefNo = stage.ref;

    return {
        ...createBillPayload,
        paymentStatus,
        paymentStages,
        paymentMethod: paymentMethod,
        paymentRefNo: paymentRefNo
    }
}

export function appendInvoiceDate(date) {
    const state = store.getState();
    const { createBillPayload } = state.orders;

    return {
        ...createBillPayload,
        invoiceDate: date
    }
}

export function formatOrderPayload(orderPayload) {
    const { products } = orderPayload;

    const castedProducts = [];

    products.map((item) => {
        let obj;
        if (item.type === "Custom") {
            obj = {
                name: item.name,
                qty: item.qty,
                mrp: item.price,
                type: "Custom",
                sgst: item.sgst,
                cgst: item.cgst,
                customDiscount: item.customDiscount,
                mrpIncludesTax: item.mrpIncludesTax
            }
        } else {
            obj = {
                productId: item.pid,
                mrp: item.price,
                qty: item.qty,
                customDiscount: item.customDiscount ? parseFloat(item.customDiscount) : 0,
                selectedUnit: item.selectedUnit,
                type: "Uploaded",
                discount: item.discount || 0,
                sp: item.sp || 0,
                sgst: item.sgst || 0,
                cgst: item.cgst || 0,
                gst: item.gst || 0
            }
        }

        castedProducts.push(obj);
    })

    return {
        ...orderPayload,
        products: castedProducts
    }
}

export function updateOrderListForPaymentSettlement(orderId, settlement) {
    const state = store.getState();
    const { orderList } = state.orders;

    const newOrderList = [];
    for (let i = 0; i < orderList.length ; i++) {
        const order = orderList[i];

        if (order.orderId === orderId) {
            const newOrder = Object.assign({}, order);
            newOrder.paymentStages.push({
                method: settlement.method,
                amount: settlement.amount,
                ref: settlement.ref
            });

            if (settlement.fullPaid) {
                newOrder.paymentStatus = "FULL";
            }

            newOrderList.push(newOrder);
        } else {
            newOrderList.push(order)
        }
    }

    store.dispatch(updateOrderList(newOrderList));
}

export function getInitialOrderState() {
    return {
        customerPhone: "",
        products: [],
        paymentMethod: "CASH",
        paymentRefNo: ""
    }
}

export function calculateSellingPrice (
    mrp,
    sgst = 0,
    cgst = 0,
    gst = 0,
    discount = 0,
    customDiscount = 0,
    quantity = 0,
    mrpIncludesTax = true
) {
    let sp = mrp - (mrp * discount)/100;
    sp = sp * quantity;

    if (!mrpIncludesTax) {
        sp = sp + (sp * sgst)/100;
        sp = sp + (sp * cgst)/100;
    }

    // sp = sp + (sp * gst)/100;
    sp = sp - customDiscount;
    
    return sp;
}

export function calculateDiscount (
    actualPrice,
    qty,
    discount = 0,
    customDiscount = 0
) {
    let dis = (discount * actualPrice * qty/100);
    dis += customDiscount;

    return dis;
}

export function calculateTax(
    total,
    sgst = 0,
    cgst = 0,
    gst = 0,
    mrpIncludesTax = true
) {
    let tax = 0;
    if (mrpIncludesTax) {
        tax += (total * sgst)/100;
        tax += (total * cgst)/100;
    }

    return tax;
}

export const getSelectedUnit = (
    selectedUnit,
    item
) => {
    const { availableUnits, smallestUnit, price } = item;
    let sUnit = availableUnits[0];
    if (item.type === "Custom") {
        return item.selectedUnit;
    }

    for (let i = 0; i < availableUnits.length ; i++) {
        const unit = availableUnits[i];
        if (unit.label === selectedUnit) {
            sUnit = unit;
        }
    }

    if (!sUnit) {
        sUnit = smallestUnit;
    }

    if (!sUnit) {
        sUnit = {
            label: "Pack",
            cFactor: 1,
            rpu: price,
        }
    }

    return sUnit;
}
