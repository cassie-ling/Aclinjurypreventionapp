import Foundation
import SwiftUI

class KneeViewModel: ObservableObject {
    @Published var selectedPart: AnatomyPart? = nil
    @Published var showInfo: Bool = false
    @Published var highlightedPartId: String? = nil
    @Published var isRotating: Bool = true

    func selectPart(id: String) {
        guard let part = anatomyParts[id] else { return }
        let haptic = UIImpactFeedbackGenerator(style: .medium)
        haptic.impactOccurred()
        selectedPart = part
        highlightedPartId = id
        withAnimation(.spring(response: 0.45, dampingFraction: 0.78)) {
            showInfo = true
        }
    }

    func dismiss() {
        withAnimation(.easeOut(duration: 0.28)) {
            showInfo = false
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.28) {
            self.selectedPart = nil
            self.highlightedPartId = nil
        }
    }

    func toggleRotation() {
        isRotating.toggle()
    }
}
