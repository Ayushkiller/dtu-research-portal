from pymongo import MongoClient
from faker import Faker
import random
from bson import ObjectId

fake = Faker()

# MongoDB Connection
client = MongoClient("mongodb+srv://admin:OvpIVRbKRSH92ZQW@cluster0.hymysuv.mongodb.net")  # Change if needed
db = client["dtu-research-portal"]  # Replace with your database name
collection = db["researchpapers"]  # Replace with your collection name

def generate_random_paper():
    authors = []
    num_authors = random.randint(1, 5)
    for _ in range(num_authors):
        authors.append({
            "name": fake.name(),
            "email": fake.email(),
            "mobileNo": fake.phone_number(),
            "isExternal": random.choice([True, False]),
            "confirmationStatus": random.choice([True, False]),
            "confirmationToken": {
                "token": fake.uuid4(),
                "used": random.choice([True, False])
            },
            "bankDetails": {
                "bankName": fake.company(),
                "branch": fake.city(),
                "accountNo": fake.bban(),
                "ifscCode": fake.swift8()
            },
            "shareValue": round(random.uniform(1000, 5000), 2)
        })
    
    return {
        "paperTitle": fake.sentence(),
        "approvedBy": ObjectId() if random.choice([True, False]) else None,
        "suspendedBy": ObjectId() if random.choice([True, False]) else None,
        "reviewedBy": ObjectId() if random.choice([True, False]) else None,
        "rejectedBy": ObjectId() if random.choice([True, False]) else None,
        "status": random.choice(["Submitted", "suspended", "underReview", "approved", "rejected", "authorshipConfirmationPending"]),
        "pubYear": str(random.randint(2000, 2025)),
        "applicantName": fake.name(),
        "email": fake.email(),
        "mobileNo": fake.phone_number(),
        "department": fake.word(),
        "applicantType": fake.word(),
        "applicantBiography": fake.text(),
        "employeeId": fake.uuid4(),
        "photograph": fake.image_url(),
        "bankDetails": {
            "bankName": fake.company(),
            "branch": fake.city(),
            "accountNo": fake.bban(),
            "ifscCode": fake.swift8()
        },
        "totalAwardAmount": round(random.uniform(5000, 50000), 2),
        "authors": authors,
        "submittedAt": fake.date_time_this_decade().isoformat(),
        "paperDetails": {fake.word(): fake.paragraph() for _ in range(3)},
        "applicantEmail": fake.email()
    }

# Generate and insert 20 research papers
data = [generate_random_paper() for _ in range(20)]
collection.insert_many(data)

print("Inserted 20 random research papers into MongoDB.")
