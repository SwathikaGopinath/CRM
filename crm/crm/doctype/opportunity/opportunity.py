import frappe
from frappe import _
from frappe.model.document import Document


class Opportunity(Document):
	def validate(self):
		if not self.lead:
			frappe.throw(_("Lead is required."))

		lead_status = frappe.db.get_value("Lead", self.lead, "status")

		if lead_status != "Qualified":
			frappe.throw(_("Only Qualified Leads can be converted into an Opportunity."))

		if self.opportunity_value < 0:
			frappe.throw(_("Opportunity Value cannot be negative."))

		probability = self.probability or 0

		if not 0 <= probability <= 100:
			frappe.throw(_("Probability must be between 0 and 100."))
