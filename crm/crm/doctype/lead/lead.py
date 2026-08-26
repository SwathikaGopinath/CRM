# Copyright (c) 2026, Team Aruvi and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.model.document import Document


class Lead(Document):
	def validate(self):
		if self.status == "Qualified":
			if not self.requirement:
				frappe.throw("Requirement is required before qualifying this Lead.")

			if self.is_new():
				frappe.throw("Lead must be contacted before it can be qualified.")

			previous_status = self.get_db_value("status")

			if previous_status not in ("Contacted", "Qualified"):
				frappe.throw("Lead must be contacted before it can be qualified.")

			if not self.qualification_date:
				self.qualification_date = frappe.utils.today()
