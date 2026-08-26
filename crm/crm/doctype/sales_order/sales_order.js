// Copyright (c) 2026, Team Aruvi and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Sales Order", {
// 	refresh(frm) {

// 	},
// });
// Copyright (c) 2026, Team Aruvi and contributors
// For license information, please see license.txt
frappe.ui.form.on("Sales Order", {
	refresh(frm) {
		if (frm.is_new()) {
			frm.set_value("status", "Draft");
		}
	},

	setup(frm) {
		frm.set_query("quotation", function () {
			return {
				filters: {
					status: "Accepted",
				},
			};
		});
	},

	validate(frm) {
		let today = frappe.datetime.get_today();

		if (frm.doc.order_date < today) {
			frappe.throw("Order Date cannot be in the past.");
		}

		if (frm.doc.delivery_date < frm.doc.order_date) {
			frappe.throw("Delivery Date cannot be before Order Date.");
		}

		calculate_totals(frm);
	},

	// IMPORTANT
	tax(frm) {
		calculate_totals(frm);
	},
});

frappe.ui.form.on("Sales Order Item", {
	qty(frm, cdt, cdn) {
		calculate_amount(frm, cdt, cdn);
	},

	rate(frm, cdt, cdn) {
		calculate_amount(frm, cdt, cdn);
	},
});

function calculate_amount(frm, cdt, cdn) {
	let row = locals[cdt][cdn];

	let amount = flt(row.qty) * flt(row.rate);

	frappe.model.set_value(cdt, cdn, "amount", amount);

	calculate_totals(frm);
}

function calculate_totals(frm) {
	let subtotal = 0;

	(frm.doc.items || []).forEach((row) => {
		subtotal += flt(row.amount);
	});

	let tax = flt(frm.doc.tax);
	let grand_total = subtotal + tax;

	frm.set_value("subtotal", subtotal);
	frm.set_value("grand_total", grand_total);

	frm.refresh_field("subtotal");
	frm.refresh_field("grand_total");
}
