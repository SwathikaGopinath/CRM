// Copyright (c) 2026, Team Aruvi and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Sales Order", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Sales Order", {
    refresh(frm) {
        if (frm.is_new() && !frm.doc.order_date) {
            frm.set_value("order_date", frappe.datetime.get_today());
        }

        calculate_totals(frm);
    },

    validate(frm) {
        if (!frm.doc.items || frm.doc.items.length === 0) {
            frappe.throw("Add at least one sales order item.");
        }

        if (
            frm.doc.delivery_date &&
            frm.doc.order_date &&
            frm.doc.delivery_date < frm.doc.order_date
        ) {
            frappe.throw("Delivery Date cannot be earlier than Order Date.");
        }

        calculate_totals(frm);
    },

    tax(frm) {
        calculate_totals(frm);
    }
});


frappe.ui.form.on("Sales Order Item", {
    qty(frm, cdt, cdn) {
        calculate_item_amount(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        calculate_item_amount(frm, cdt, cdn);
    },

    items_add(frm, cdt, cdn) {
        calculate_item_amount(frm, cdt, cdn);
    }
});


function calculate_item_amount(frm, cdt, cdn) {
    const row = locals[cdt][cdn];

    if (row.qty <= 0) {
        frappe.throw("Quantity must be greater than 0.");
    }

    if (row.rate < 0) {
        frappe.throw("Rate cannot be negative.");
    }

    frappe.model.set_value(
        cdt,
        cdn,
        "amount",
        (row.qty || 0) * (row.rate || 0)
    );

    calculate_totals(frm);
}


function calculate_totals(frm) {
    let subtotal = 0;

    (frm.doc.items || []).forEach(row => {
        subtotal += (row.qty || 0) * (row.rate || 0);
    });

    frm.set_value("subtotal", subtotal);

    frm.set_value(
        "grand_total",
        subtotal + (frm.doc.tax || 0)
    );
}
