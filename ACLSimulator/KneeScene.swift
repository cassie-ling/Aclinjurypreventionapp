import SceneKit
import UIKit

// MARK: - Colors
private enum BoneColor {
    static let bone       = UIColor(red: 0.94, green: 0.88, blue: 0.74, alpha: 1.0)
    static let boneShadow = UIColor(red: 0.82, green: 0.73, blue: 0.56, alpha: 1.0)
    static let ligament   = UIColor(red: 0.96, green: 0.90, blue: 0.72, alpha: 1.0)
    static let acl        = UIColor(red: 0.98, green: 0.87, blue: 0.60, alpha: 1.0)
    static let pcl        = UIColor(red: 0.92, green: 0.80, blue: 0.52, alpha: 1.0)
    static let mcl        = UIColor(red: 0.94, green: 0.88, blue: 0.74, alpha: 0.90)
    static let lcl        = UIColor(red: 0.94, green: 0.88, blue: 0.74, alpha: 0.90)
    static let meniscus   = UIColor(red: 0.40, green: 0.62, blue: 0.85, alpha: 0.88)
    static let cartilage  = UIColor(red: 0.70, green: 0.85, blue: 0.95, alpha: 0.70)
}

// MARK: - Scene Builder
class KneeSceneBuilder {

    static func buildScene() -> SCNScene {
        let scene = SCNScene()
        scene.background.contents = UIColor(red: 0.04, green: 0.06, blue: 0.12, alpha: 1.0)

        let kneeNode = SCNNode()
        kneeNode.name = "knee_root"

        // Bones
        kneeNode.addChildNode(makeFemur())
        kneeNode.addChildNode(makeTibia())
        kneeNode.addChildNode(makeFibula())
        kneeNode.addChildNode(makePatella())

        // Cartilage
        kneeNode.addChildNode(makeArticularCartilage())

        // Menisci
        kneeNode.addChildNode(makeMedialMeniscus())
        kneeNode.addChildNode(makeLateralMeniscus())

        // Ligaments (drawn last so they render over bones)
        kneeNode.addChildNode(makeACL())
        kneeNode.addChildNode(makePCL())
        kneeNode.addChildNode(makeMCL())
        kneeNode.addChildNode(makeLCL())

        scene.rootNode.addChildNode(kneeNode)
        addLighting(to: scene)

        return scene
    }

    // MARK: Femur
    private static func makeFemur() -> SCNNode {
        let root = SCNNode()
        root.name = "femur"

        // Shaft
        let shaft = SCNCylinder(radius: 0.038, height: 0.38)
        shaft.radialSegmentCount = 20
        applyMaterial(shaft, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.4)
        let shaftNode = SCNNode(geometry: shaft)
        shaftNode.position = SCNVector3(0, 0.32, 0)
        root.addChildNode(shaftNode)

        // Medial condyle
        let medCon = SCNSphere(radius: 0.058)
        medCon.segmentCount = 24
        applyMaterial(medCon, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.5)
        let medNode = SCNNode(geometry: medCon)
        medNode.position = SCNVector3(-0.048, 0.10, 0.005)
        root.addChildNode(medNode)

        // Lateral condyle
        let latCon = SCNSphere(radius: 0.056)
        latCon.segmentCount = 24
        applyMaterial(latCon, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.5)
        let latNode = SCNNode(geometry: latCon)
        latNode.position = SCNVector3(0.048, 0.10, 0.005)
        root.addChildNode(latNode)

        // Intercondylar notch fill
        let notch = SCNCylinder(radius: 0.022, height: 0.06)
        notch.radialSegmentCount = 16
        applyMaterial(notch, diffuse: BoneColor.boneShadow, specular: UIColor.clear, shininess: 0)
        let notchNode = SCNNode(geometry: notch)
        notchNode.position = SCNVector3(0, 0.10, -0.010)
        root.addChildNode(notchNode)

        return root
    }

    // MARK: Tibia
    private static func makeTibia() -> SCNNode {
        let root = SCNNode()
        root.name = "tibia"

        // Tibial plateau
        let plateau = SCNCylinder(radius: 0.088, height: 0.022)
        plateau.radialSegmentCount = 24
        applyMaterial(plateau, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.4)
        let plateauNode = SCNNode(geometry: plateau)
        plateauNode.position = SCNVector3(0, -0.038, 0)
        root.addChildNode(plateauNode)

        // Tibial eminence (spine)
        let spine = SCNCapsule(capRadius: 0.012, height: 0.030)
        spine.radialSegmentCount = 12
        applyMaterial(spine, diffuse: BoneColor.boneShadow, specular: UIColor.white, shininess: 0.3)
        let spineNode = SCNNode(geometry: spine)
        spineNode.position = SCNVector3(0, -0.018, 0)
        root.addChildNode(spineNode)

        // Shaft
        let shaft = SCNCylinder(radius: 0.034, height: 0.36)
        shaft.radialSegmentCount = 20
        applyMaterial(shaft, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.4)
        let shaftNode = SCNNode(geometry: shaft)
        shaftNode.position = SCNVector3(0, -0.23, 0)
        root.addChildNode(shaftNode)

        // Tibial tuberosity
        let tub = SCNCapsule(capRadius: 0.016, height: 0.042)
        applyMaterial(tub, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.3)
        let tubNode = SCNNode(geometry: tub)
        tubNode.position = SCNVector3(0.005, -0.085, 0.040)
        tubNode.eulerAngles = SCNVector3(Float.pi / 2.4, 0, 0)
        root.addChildNode(tubNode)

        return root
    }

    // MARK: Fibula
    private static func makeFibula() -> SCNNode {
        let root = SCNNode()
        root.name = "fibula"

        let head = SCNSphere(radius: 0.028)
        head.segmentCount = 16
        applyMaterial(head, diffuse: BoneColor.boneShadow, specular: UIColor.white, shininess: 0.3)
        let headNode = SCNNode(geometry: head)
        headNode.position = SCNVector3(0.095, -0.065, 0)
        root.addChildNode(headNode)

        let shaft = SCNCylinder(radius: 0.016, height: 0.32)
        shaft.radialSegmentCount = 14
        applyMaterial(shaft, diffuse: BoneColor.boneShadow, specular: UIColor.white, shininess: 0.3)
        let shaftNode = SCNNode(geometry: shaft)
        shaftNode.position = SCNVector3(0.098, -0.24, 0)
        root.addChildNode(shaftNode)

        return root
    }

    // MARK: Patella
    private static func makePatella() -> SCNNode {
        let root = SCNNode()
        root.name = "patella"

        let geo = SCNSphere(radius: 0.042)
        geo.segmentCount = 20
        applyMaterial(geo, diffuse: BoneColor.bone, specular: UIColor.white, shininess: 0.5)
        root.geometry = geo
        root.position = SCNVector3(0.002, 0.082, 0.095)
        root.scale = SCNVector3(1.0, 1.2, 0.7)
        return root
    }

    // MARK: Articular Cartilage
    private static func makeArticularCartilage() -> SCNNode {
        let root = SCNNode()

        // Medial femoral cartilage cap
        let medCart = SCNSphere(radius: 0.062)
        medCart.segmentCount = 20
        applyMaterial(medCart, diffuse: BoneColor.cartilage, specular: UIColor.white, shininess: 0.8)
        let medNode = SCNNode(geometry: medCart)
        medNode.position = SCNVector3(-0.048, 0.10, 0.005)
        root.addChildNode(medNode)

        // Lateral femoral cartilage cap
        let latCart = SCNSphere(radius: 0.060)
        latCart.segmentCount = 20
        applyMaterial(latCart, diffuse: BoneColor.cartilage, specular: UIColor.white, shininess: 0.8)
        let latNode = SCNNode(geometry: latCart)
        latNode.position = SCNVector3(0.048, 0.10, 0.005)
        root.addChildNode(latNode)

        return root
    }

    // MARK: Medial Meniscus
    private static func makeMedialMeniscus() -> SCNNode {
        let root = SCNNode()
        root.name = "medial_meniscus"

        // Approximate C-shape with a torus (inner radius larger on lateral side)
        let torus = SCNTorus(ringRadius: 0.038, pipeRadius: 0.014)
        torus.ringSegmentCount = 32
        torus.pipeSegmentCount = 14
        applyMaterial(torus, diffuse: BoneColor.meniscus, specular: UIColor.white, shininess: 0.6)

        let node = SCNNode(geometry: torus)
        node.position = SCNVector3(-0.042, -0.038, 0.004)
        // Scale to make it C-shaped (flatten on lateral aspect)
        node.scale = SCNVector3(0.80, 0.45, 1.0)
        root.addChildNode(node)

        return root
    }

    // MARK: Lateral Meniscus
    private static func makeLateralMeniscus() -> SCNNode {
        let root = SCNNode()
        root.name = "lateral_meniscus"

        let torus = SCNTorus(ringRadius: 0.035, pipeRadius: 0.013)
        torus.ringSegmentCount = 32
        torus.pipeSegmentCount = 14
        applyMaterial(torus, diffuse: BoneColor.meniscus, specular: UIColor.white, shininess: 0.6)

        let node = SCNNode(geometry: torus)
        node.position = SCNVector3(0.042, -0.038, 0.004)
        node.scale = SCNVector3(0.90, 0.45, 1.0)
        root.addChildNode(node)

        return root
    }

    // MARK: ACL
    private static func makeACL() -> SCNNode {
        let start = SCNVector3(-0.012, -0.020, 0.030)
        let end   = SCNVector3( 0.008,  0.095, -0.018)
        let node = ligamentCylinder(from: start, to: end, radius: 0.013, color: BoneColor.acl)
        node.name = "acl"
        node.opacity = 0.95
        return node
    }

    // MARK: PCL
    private static func makePCL() -> SCNNode {
        let start = SCNVector3( 0.010, -0.020, -0.025)
        let end   = SCNVector3(-0.006,  0.095,  0.018)
        let node = ligamentCylinder(from: start, to: end, radius: 0.016, color: BoneColor.pcl)
        node.name = "pcl"
        node.opacity = 0.92
        return node
    }

    // MARK: MCL
    private static func makeMCL() -> SCNNode {
        let start = SCNVector3(-0.102, -0.060, 0.004)
        let end   = SCNVector3(-0.095,  0.130, 0.004)
        let node = ligamentCylinder(from: start, to: end, radius: 0.010, color: BoneColor.mcl)
        node.name = "mcl"
        node.opacity = 0.88
        return node
    }

    // MARK: LCL
    private static func makeLCL() -> SCNNode {
        let start = SCNVector3(0.095, -0.062, 0.004)
        let end   = SCNVector3(0.100,  0.130, 0.004)
        let node = ligamentCylinder(from: start, to: end, radius: 0.009, color: BoneColor.lcl)
        node.name = "lcl"
        node.opacity = 0.88
        return node
    }

    // MARK: Helpers

    static func ligamentCylinder(from start: SCNVector3, to end: SCNVector3, radius: CGFloat, color: UIColor) -> SCNNode {
        let dx = end.x - start.x
        let dy = end.y - start.y
        let dz = end.z - start.z
        let distance = sqrt(dx*dx + dy*dy + dz*dz)

        let cyl = SCNCylinder(radius: radius, height: CGFloat(distance))
        cyl.radialSegmentCount = 14
        applyMaterial(cyl, diffuse: color, specular: UIColor.white, shininess: 0.3)

        let node = SCNNode(geometry: cyl)
        node.position = SCNVector3((start.x+end.x)/2, (start.y+end.y)/2, (start.z+end.z)/2)

        let up = simd_float3(0, 1, 0)
        let dir = simd_normalize(simd_float3(dx, dy, dz))
        let axis = simd_cross(up, dir)
        let dot = simd_dot(up, dir)
        let angle = acos(dot)

        if simd_length(axis) > 0.001 {
            node.rotation = SCNVector4(axis.x, axis.y, axis.z, angle)
        }
        return node
    }

    private static func applyMaterial(_ geo: SCNGeometry, diffuse: UIColor, specular: UIColor, shininess: CGFloat) {
        let mat = SCNMaterial()
        mat.diffuse.contents = diffuse
        mat.specular.contents = specular
        mat.shininess = shininess
        mat.lightingModel = .phong
        geo.materials = [mat]
    }

    // MARK: Lighting
    private static func addLighting(to scene: SCNScene) {
        // Key light
        let keyLight = SCNLight()
        keyLight.type = .directional
        keyLight.intensity = 1000
        keyLight.color = UIColor(white: 1.0, alpha: 1.0)
        keyLight.castsShadow = true
        keyLight.shadowMode = .deferred
        let keyNode = SCNNode()
        keyNode.light = keyLight
        keyNode.eulerAngles = SCNVector3(-Float.pi/4, Float.pi/6, 0)
        scene.rootNode.addChildNode(keyNode)

        // Fill light
        let fillLight = SCNLight()
        fillLight.type = .directional
        fillLight.intensity = 400
        fillLight.color = UIColor(red: 0.75, green: 0.85, blue: 1.0, alpha: 1.0)
        let fillNode = SCNNode()
        fillNode.light = fillLight
        fillNode.eulerAngles = SCNVector3(Float.pi/5, -Float.pi/3, 0)
        scene.rootNode.addChildNode(fillNode)

        // Rim light
        let rimLight = SCNLight()
        rimLight.type = .directional
        rimLight.intensity = 300
        rimLight.color = UIColor(red: 0.60, green: 0.75, blue: 1.0, alpha: 1.0)
        let rimNode = SCNNode()
        rimNode.light = rimLight
        rimNode.eulerAngles = SCNVector3(Float.pi/6, Float.pi + Float.pi/4, 0)
        scene.rootNode.addChildNode(rimNode)

        // Ambient
        let ambient = SCNLight()
        ambient.type = .ambient
        ambient.intensity = 180
        ambient.color = UIColor(red: 0.15, green: 0.18, blue: 0.30, alpha: 1.0)
        let ambNode = SCNNode()
        ambNode.light = ambient
        scene.rootNode.addChildNode(ambNode)
    }
}

// MARK: - Highlight Helper
extension SCNNode {
    func applyHighlight(color: UIColor) {
        if let geo = geometry {
            let mat = geo.firstMaterial?.copy() as? SCNMaterial ?? SCNMaterial()
            mat.emission.contents = color.withAlphaComponent(0.45)
            geo.materials = [mat]
        }
        childNodes.forEach { $0.applyHighlight(color: color) }
    }

    func removeHighlight() {
        if let geo = geometry {
            let mat = geo.firstMaterial?.copy() as? SCNMaterial ?? SCNMaterial()
            mat.emission.contents = UIColor.black
            geo.materials = [mat]
        }
        childNodes.forEach { $0.removeHighlight() }
    }
}
