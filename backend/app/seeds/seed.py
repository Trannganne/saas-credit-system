from app.database import SessionLocal
from app.models.feature import Feature
from app.models.package import Package
from app.models.package_features import PackageFeature

# Dữ liệu mẫu cho Feature
FEATURES = [
    {
        "id": "f_basic_chat",
        "name": "Basic AI Chat",
        "description": "Access to the standard AI chatbot for daily usage",
        "cost": 1
    },
    {
        "id": "f_ai_image",
        "name": "AI Image Generation",
        "description": "Generate AI images from text prompts",
        "cost": 10
    },
    {
        "id": "f_auto_post",
        "name": "Auto Social Posting",
        "description": "Automatically publish posts to connected social media accounts",
        "cost": 5
    },
    {
        "id": "f_content_scheduler",
        "name": "Content Scheduler",
        "description": "Schedule posts and campaigns to run automatically",
        "cost": 3
    },
    {
        "id": "f_pdf_export",
        "name": "PDF Export",
        "description": "Export reports and generated content as PDF files",
        "cost": 2
    },
    {
        "id": "f_email_campaign",
        "name": "Email Campaign",
        "description": "Send email campaigns to customer mailing lists",
        "cost": 8
    },
    {
        "id": "f_analytics",
        "name": "Advanced Analytics",
        "description": "View advanced analytics and performance dashboards",
        "cost": 12
    },
    {
        "id": "f_api_access",
        "name": "Developer API Access",
        "description": "Access public APIs for third-party integrations",
        "cost": 15
    },
    {
        "id": "f_team_workspace",
        "name": "Team Workspace",
        "description": "Invite and manage team members in shared workspaces",
        "cost": 6
    },
    {
        "id": "f_priority_support",
        "name": "Priority Support",
        "description": "Receive faster support response times and priority handling",
        "cost": 4
    }
]

# Dữ liệu mẫu cho Package
PACKAGES = [
    Package(
        id="pkg_free",
        name="Free",
        description="Free package for new users",
        price=0,
        credits=10
    ),
    Package(
        id="pkg_starter",
        name="Starter",
        description="Starter package for personal use",
        price=9.99,
        credits=100
    ),
    Package(
        id="pkg_pro",
        name="Pro",
        description="Professional package",
        price=29.99,
        credits=500
    ),
    Package(
        id="pkg_enterprise",
        name="Enterprise",
        description="Enterprise package for businesses",
        price=99.99,
        credits=5000
    )
]

# Dữ liệu gán Feature cho Package
PACKAGE_FEATURES=[
    PackageFeature(
        id="pf1",
        package_id="pkg_free",
        feature_id="f_basic_chat"
    ),

    PackageFeature(
        id="pf2",
        package_id="pkg_starter",
        feature_id="f_basic_chat"
    ),

    PackageFeature(
        id="pf3",
        package_id="pkg_starter",
        feature_id="f_pdf_export"
    ),

    PackageFeature(
        id="pf4",
        package_id="pkg_starter",
        feature_id="f_content_scheduler"
    ),

    PackageFeature(
        id="pf5",
        package_id="pkg_pro",
        feature_id="f_ai_image"
    ),

    PackageFeature(
        id="pf6",
        package_id="pkg_pro",
        feature_id="f_auto_post"
    ),

    PackageFeature(
        id="pf7",
        package_id="pkg_enterprise",
        feature_id="f_api_access"
    ),
]

def seed_data():
    db=SessionLocal()

    # Seed Features
    for f in FEATURES:
        exists=db.query(Feature).filter(Feature.id==f["id"]).first()

        if not exists:
            db.add(Feature(**f))

    db.commit()

    # Seed Packages
    for p in PACKAGES:
        exists=db.query(Package).filter(Package.id==p.id).first()

        if not exists:
            db.add(p)
    
    db.commit()

    # Seed Package Features
    for pf in PACKAGE_FEATURES:
        exists=db.query(PackageFeature).filter(PackageFeature.id==pf.id).first()

        if not exists:
            db.add(pf)
    
    db.commit()
    db.close()
    