import UIKit

struct AnatomyPart: Identifiable {
    let id: String
    let name: String
    let shortDescription: String
    let fullDescription: String
    let accentColor: UIColor
    let category: Category

    enum Category: String {
        case ligament = "Ligament"
        case bone = "Bone"
        case cartilage = "Cartilage"
    }
}

let anatomyParts: [String: AnatomyPart] = [
    "acl": AnatomyPart(
        id: "acl",
        name: "Anterior Cruciate Ligament",
        shortDescription: "Primary stabilizer against forward tibial displacement and rotation.",
        fullDescription: "The ACL runs diagonally through the center of the knee, connecting the anterior tibia to the posterior femur. It prevents the tibia from sliding forward relative to the femur and controls rotational stability. ACL tears are among the most common sports injuries, often occurring during sudden pivots, cuts, or landing from a jump. Reconstruction typically uses a patellar tendon or hamstring graft.",
        accentColor: UIColor(red: 1.00, green: 0.76, blue: 0.30, alpha: 1.0),
        category: .ligament
    ),
    "pcl": AnatomyPart(
        id: "pcl",
        name: "Posterior Cruciate Ligament",
        shortDescription: "The strongest knee ligament — resists posterior tibial shift.",
        fullDescription: "The PCL is approximately twice as strong as the ACL and connects the posterior tibia to the anterior femur. It prevents the tibia from sliding backward under the femur. PCL injuries are less common and typically result from direct trauma such as a dashboard injury in a car accident or a fall on a bent knee. Isolated PCL tears are often managed conservatively.",
        accentColor: UIColor(red: 0.95, green: 0.60, blue: 0.20, alpha: 1.0),
        category: .ligament
    ),
    "mcl": AnatomyPart(
        id: "mcl",
        name: "Medial Collateral Ligament",
        shortDescription: "Stabilizes the inner knee against valgus (inward) stress.",
        fullDescription: "The MCL is a broad, flat band running along the inner side of the knee from the medial femoral epicondyle to the medial tibia. It resists valgus forces that push the knee inward. MCL injuries are among the most common knee ligament injuries, typically occurring from a direct blow to the outer knee. Most isolated MCL tears heal well with conservative treatment.",
        accentColor: UIColor(red: 0.30, green: 0.78, blue: 0.95, alpha: 1.0),
        category: .ligament
    ),
    "lcl": AnatomyPart(
        id: "lcl",
        name: "Lateral Collateral Ligament",
        shortDescription: "Stabilizes the outer knee against varus (outward) stress.",
        fullDescription: "The LCL is a cord-like ligament on the outer side of the knee connecting the lateral femoral epicondyle to the fibular head. It resists varus forces that push the knee outward. LCL injuries are less common and usually involve damage to other posterolateral structures as well. The LCL is part of the posterolateral corner complex that provides rotational stability.",
        accentColor: UIColor(red: 0.35, green: 0.90, blue: 0.60, alpha: 1.0),
        category: .ligament
    ),
    "femur": AnatomyPart(
        id: "femur",
        name: "Femur",
        shortDescription: "The thigh bone — longest and strongest bone in the body.",
        fullDescription: "The distal femur forms the upper portion of the knee joint. Its two rounded condyles (medial and lateral) articulate with the tibia and rest on the menisci. The intercondylar notch between them houses the cruciate ligaments. The femur transmits compressive forces from the body weight through the knee and serves as the origin of the collateral ligaments and capsular structures.",
        accentColor: UIColor(red: 0.95, green: 0.78, blue: 0.50, alpha: 1.0),
        category: .bone
    ),
    "tibia": AnatomyPart(
        id: "tibia",
        name: "Tibia",
        shortDescription: "The shin bone — primary weight-bearing bone of the lower leg.",
        fullDescription: "The proximal tibia forms the lower portion of the knee joint. Its flat upper surface, the tibial plateau, is divided into medial and lateral compartments by the tibial eminence. The ACL and PCL attach to the tibial spine. The tibia bears approximately 85% of the body's load and is the insertion point for several key ligaments and the patellar tendon.",
        accentColor: UIColor(red: 0.85, green: 0.68, blue: 0.42, alpha: 1.0),
        category: .bone
    ),
    "fibula": AnatomyPart(
        id: "fibula",
        name: "Fibula",
        shortDescription: "Slender lateral bone serving as LCL and biceps femoris anchor.",
        fullDescription: "Although the fibula does not directly form the knee joint, its head articulates with the posterolateral tibia just below the joint line. The fibular head is the distal attachment of the LCL and the biceps femoris tendon. It also anchors several posterolateral corner structures critical to rotational stability. Avulsion fractures of the fibular head can occur with LCL injuries.",
        accentColor: UIColor(red: 0.75, green: 0.62, blue: 0.38, alpha: 1.0),
        category: .bone
    ),
    "patella": AnatomyPart(
        id: "patella",
        name: "Patella",
        shortDescription: "The kneecap — a sesamoid bone that amplifies quadriceps force.",
        fullDescription: "The patella is the largest sesamoid bone in the body, embedded within the quadriceps tendon. It articulates with the trochlear groove of the femur, forming the patellofemoral joint. The patella increases the mechanical advantage of the quadriceps by up to 30%, reducing the force needed to extend the knee. Patellofemoral pain syndrome and patellar instability are common conditions affecting this structure.",
        accentColor: UIColor(red: 1.00, green: 0.85, blue: 0.55, alpha: 1.0),
        category: .bone
    ),
    "medial_meniscus": AnatomyPart(
        id: "medial_meniscus",
        name: "Medial Meniscus",
        shortDescription: "C-shaped cartilage disc absorbing shock on the inner knee.",
        fullDescription: "The medial meniscus is a crescent-shaped fibrocartilage structure that deepens the tibial plateau and acts as a primary shock absorber, distributing up to 50% of the compressive load in the medial compartment. It is firmly attached peripherally to the joint capsule and MCL, making it less mobile and more prone to tear than the lateral meniscus. Meniscal tears are the most common knee injury requiring surgery.",
        accentColor: UIColor(red: 0.30, green: 0.62, blue: 0.92, alpha: 1.0),
        category: .cartilage
    ),
    "lateral_meniscus": AnatomyPart(
        id: "lateral_meniscus",
        name: "Lateral Meniscus",
        shortDescription: "Near-circular cartilage disc cushioning the outer knee compartment.",
        fullDescription: "The lateral meniscus is more circular than the medial and covers a greater area of the lateral tibial plateau. It is more loosely attached to the capsule, giving it greater mobility and making it less susceptible to tearing. The lateral meniscus absorbs approximately 70% of the compressive load in the lateral compartment. Lateral meniscus tears frequently occur in conjunction with ACL injuries.",
        accentColor: UIColor(red: 0.25, green: 0.55, blue: 0.88, alpha: 1.0),
        category: .cartilage
    )
]
