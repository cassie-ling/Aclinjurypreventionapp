import SwiftUI
import SceneKit

struct KneeSceneView: UIViewRepresentable {
    @ObservedObject var viewModel: KneeViewModel

    func makeUIView(context: Context) -> SCNView {
        let sceneView = SCNView()
        sceneView.scene = KneeSceneBuilder.buildScene()
        sceneView.backgroundColor = UIColor(red: 0.04, green: 0.06, blue: 0.12, alpha: 1.0)
        sceneView.allowsCameraControl = true
        sceneView.autoenablesDefaultLighting = false
        sceneView.antialiasingMode = .multisampling4X
        sceneView.preferredFramesPerSecond = 60

        // Camera
        let camera = SCNCamera()
        camera.fieldOfView = 42
        camera.zNear = 0.01
        camera.zFar = 100
        let cameraNode = SCNNode()
        cameraNode.camera = camera
        cameraNode.position = SCNVector3(0, 0.08, 1.0)
        sceneView.scene?.rootNode.addChildNode(cameraNode)
        sceneView.pointOfView = cameraNode

        // Auto-rotate
        startAutoRotate(in: sceneView)

        // Tap gesture
        let tap = UITapGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handleTap(_:)))
        sceneView.addGestureRecognizer(tap)

        context.coordinator.sceneView = sceneView
        return sceneView
    }

    func updateUIView(_ uiView: SCNView, context: Context) {
        guard let root = uiView.scene?.rootNode.childNode(withName: "knee_root", recursively: false) else { return }

        // Reset all highlights
        root.childNodes.forEach { $0.removeHighlight() }

        // Apply highlight to selected part
        if let id = viewModel.highlightedPartId,
           let part = anatomyParts[id],
           let node = root.childNode(withName: id, recursively: true) {
            node.applyHighlight(color: part.accentColor)
        }

        // Pause/resume rotation
        if let action = uiView.scene?.rootNode.action(forKey: "autoRotate") {
            _ = action
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(viewModel: viewModel)
    }

    private func startAutoRotate(in sceneView: SCNView) {
        guard let kneeRoot = sceneView.scene?.rootNode.childNode(withName: "knee_root", recursively: false) else { return }
        let rotate = SCNAction.repeatForever(SCNAction.rotateBy(x: 0, y: 2 * .pi, z: 0, duration: 14))
        kneeRoot.runAction(rotate, forKey: "autoRotate")
    }

    // MARK: Coordinator
    class Coordinator: NSObject {
        var viewModel: KneeViewModel
        weak var sceneView: SCNView?

        init(viewModel: KneeViewModel) {
            self.viewModel = viewModel
        }

        @objc func handleTap(_ gesture: UITapGestureRecognizer) {
            guard let sceneView = sceneView else { return }
            let location = gesture.location(in: sceneView)
            let hits = sceneView.hitTest(location, options: [
                .searchMode: SCNHitTestSearchMode.closest.rawValue,
                .ignoreHiddenNodes: true
            ])

            // Walk up node hierarchy to find a named anatomy part
            for hit in hits {
                var node: SCNNode? = hit.node
                while let n = node {
                    if let name = n.name, anatomyParts[name] != nil {
                        pauseRotation()
                        DispatchQueue.main.async {
                            self.viewModel.selectPart(id: name)
                        }
                        return
                    }
                    node = n.parent
                }
            }

            // Tapped empty space — dismiss
            DispatchQueue.main.async {
                self.viewModel.dismiss()
            }
        }

        private func pauseRotation() {
            guard let sceneView = sceneView,
                  let kneeRoot = sceneView.scene?.rootNode.childNode(withName: "knee_root", recursively: false) else { return }
            kneeRoot.removeAction(forKey: "autoRotate")

            // Resume after 6 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 6.0) {
                let rotate = SCNAction.repeatForever(SCNAction.rotateBy(x: 0, y: 2 * .pi, z: 0, duration: 14))
                kneeRoot.runAction(rotate, forKey: "autoRotate")
            }
        }
    }
}
