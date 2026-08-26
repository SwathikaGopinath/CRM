# Copyright (c) 2026, Team Aruvi and contributors
# For license information, please see license.txt
# Copyright (c) 2026, Team Aruvi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SalesOrder(Document):
	def validate(self):
		self.validate_items()
		self.validate_dates()
		self.validate_status()
		self.calculate_totals()

	def validate_items(self):
		if not self.items:
			frappe.throw("At least one sales order item is required.")

		for item in self.items:
			if not item.qty or item.qty <= 0:
				frappe.throw(f"Quantity must be greater than 0 for item {item.item_name}.")

			if item.rate is None or item.rate < 0:
				frappe.throw(f"Rate cannot be negative for item {item.item_name}.")

			item.amount = item.qty * item.rate

	def validate_dates(self):
		if self.delivery_date and self.order_date:
			if self.delivery_date < self.order_date:
				frappe.throw("Delivery Date cannot be earlier than Order Date.")

	def validate_status(self):
		if not self.status:
			self.status = "Pending"

		if self.is_new() and self.status != "Pending":
			frappe.throw("New Sales Order must have Pending status.")

	def calculate_totals(self):
		subtotal = 0

		for item in self.items:
			subtotal += item.amount

		self.subtotal = subtotal
		self.grand_total = subtotal + (self.tax or 0)
