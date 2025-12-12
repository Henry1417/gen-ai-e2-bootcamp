import json
import random

CATEGORIES = [
    "Network Issues",
    "Security",
    "Performance",
    "Database",
    "Integration",
    "UI/UX",
    "Hardware",
    "Software Bug",
    "Data Loss",
    "Authentication",
    "Billing",
    "Account Management",
    "Feature Request",
    "Configuration"
]

TEMPLATES = [
    # Authentication
    ("Cannot login to my account", "Authentication"),
    ("Password reset link not working", "Authentication"),
    ("Two-factor authentication not working", "Authentication"),
    ("Session expires too quickly", "Authentication"),
    ("Forgot password email not arriving", "Authentication"),
    
    # Network Issues
    ("Connection timeout when uploading files", "Network Issues"),
    ("API requests are timing out", "Network Issues"),
    ("Cannot connect to VPN", "Network Issues"),
    ("Slow internet connection affecting app", "Network Issues"),
    ("WebSocket connection keeps dropping", "Network Issues"),
    
    # Performance
    ("App crashes on startup", "Software Bug"),
    ("Slow performance on dashboard", "Performance"),
    ("Page takes too long to load", "Performance"),
    ("High memory usage causing freezes", "Performance"),
    ("Database queries are very slow", "Database"),
    
    # Billing
    ("Charged twice for the subscription", "Billing"),
    ("Invoice not received", "Billing"),
    ("Update payment method failed", "Billing"),
    ("Refund request for last month", "Billing"),
    ("Subscription not canceled properly", "Billing"),
    ("Wrong amount charged", "Billing"),
    
    # Account Management
    ("Change username", "Account Management"),
    ("Delete my account", "Account Management"),
    ("Upgrade to premium plan", "Account Management"),
    ("Cannot update profile picture", "Account Management"),
    ("Email notifications not working", "Configuration"),
    
    # Feature Request
    ("Add dark mode support", "Feature Request"),
    ("Integration with Slack", "Integration"),
    ("Export data to CSV", "Feature Request"),
    ("Mobile app support", "Feature Request"),
    ("Add multi-language support", "Feature Request"),
    
    # Security
    ("Suspicious login attempt detected", "Security"),
    ("Account was hacked", "Security"),
    ("Data breach concern", "Security"),
    ("Enable encryption for my data", "Security"),
    
    # UI/UX
    ("Button is not clickable", "UI/UX"),
    ("Layout broken on mobile", "UI/UX"),
    ("Text is too small to read", "UI/UX"),
    ("Color contrast is poor", "UI/UX"),
    
    # Software Bug
    ("Error message when saving data", "Software Bug"),
    ("App crashes when clicking submit", "Software Bug"),
    ("Data not syncing properly", "Software Bug"),
    ("Search function returns wrong results", "Software Bug"),
    
    # Data Loss
    ("Lost all my files after update", "Data Loss"),
    ("Cannot find my previous work", "Data Loss"),
    ("Data disappeared from dashboard", "Data Loss"),
    
    # Database
    ("Database connection error", "Database"),
    ("Cannot retrieve my records", "Database"),
    ("Data not saving to database", "Database"),
    
    # Hardware
    ("Printer not connecting", "Hardware"),
    ("Scanner not working", "Hardware"),
    ("Microphone not detected", "Hardware"),
    
    # Integration
    ("Google Calendar sync not working", "Integration"),
    ("Zapier integration failing", "Integration"),
    ("API key not authenticating", "Integration"),
    
    # Configuration
    ("Cannot change settings", "Configuration"),
    ("Preferences not saving", "Configuration"),
    ("Timezone settings incorrect", "Configuration")
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
