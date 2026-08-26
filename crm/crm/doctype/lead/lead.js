// Copyright (c) 2026, Team Aruvi and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Lead", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("Lead", {
	status(frm) {
		if (frm.doc.status === "Qualified" && frm.doc.requirement) {
			frm.set_value("qualification_date", frappe.datetime.get_today());
		}
	},

	validate(frm) {
		if (frm.doc.status === "Qualified") {
			if (!frm.doc.requirement) {
				frappe.throw("Please enter the Lead Requirement before qualifying this Lead.");
			}

			if (!frm.doc.qualification_date) {
				frm.set_value("qualification_date", frappe.datetime.get_today());
			}
		}
	},
});
