import json
import random

CATEGORIES = ["Technical", "Billing", "Account", "Feature Request"]

TEMPLATES = [
    ("Cannot login to my account", "Technical"),
    ("Password reset link not working", "Technical"),
    ("App crashes on startup", "Technical"),
    ("Slow performance on dashboard", "Technical"),
    ("Charged twice for the subscription", "Billing"),
    ("Invoice not received", "Billing"),
    ("Update payment method failed", "Billing"),
    ("Refund request for last month", "Billing"),
    ("Change username", "Account"),
    ("Delete my account", "Account"),
    ("Upgrade to premium plan", "Account"),
    ("Add dark mode support", "Feature Request"),
    ("Integration with Slack", "Feature Request"),
    ("Export data to CSV", "Feature Request"),
    ("Mobile app support", "Feature Request")
]

def generate_tickets(n=50):
    tickets = []
    for i in range(1, n + 1):
        subject_template, category = random.choice(TEMPLATES)
        
        # Add some variation
        variations = [
            f"{subject_template}",
            f"Issue: {subject_template}",
            f"Help with {subject_template.lower()}",
            f"Urgent: {subject_template}"
        ]
        
        subject = random.choice(variations)
        description = f"User is reporting: {subject}. Category seems to be related to {category}."
        
        tickets.append({
            "id": i,
            "subject": subject,
            "description": description,
            "category": category
        })
    
    return tickets

if __name__ == "__main__":
    data = generate_tickets()
    with open("tickets.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(data)} tickets in tickets.json")
