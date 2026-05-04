import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = KneeViewModel()

    var body: some View {
        ZStack(alignment: .bottom) {
            // 3D Scene — fills entire screen
            KneeSceneView(viewModel: viewModel)
                .ignoresSafeArea()

            // Top header bar
            VStack {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("ACL Simulator")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                        Text("Tap any structure to explore")
                            .font(.system(size: 12, weight: .regular))
                            .foregroundColor(.white.opacity(0.50))
                    }
                    Spacer()
                    Image(systemName: "cross.circle.fill")
                        .font(.system(size: 28))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color(red: 0.40, green: 0.70, blue: 1.0), Color(red: 0.25, green: 0.50, blue: 0.90)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }
                .padding(.horizontal, 22)
                .padding(.top, 12)
                .padding(.bottom, 14)
                .background(
                    LinearGradient(
                        colors: [Color(red: 0.04, green: 0.06, blue: 0.14), Color(red: 0.04, green: 0.06, blue: 0.14).opacity(0)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                Spacer()
            }
            .ignoresSafeArea(edges: .top)

            // Selected part label chip (above the card)
            if viewModel.showInfo, let part = viewModel.selectedPart {
                VStack {
                    Spacer()
                    PartLabelChip(name: part.name, color: part.accentColor)
                        .padding(.bottom, 8)
                        .transition(.opacity.combined(with: .scale(scale: 0.92)))
                    // bottom sheet placeholder height so chip sits above card
                    Color.clear.frame(height: 370)
                }
                .ignoresSafeArea(edges: .bottom)
            }

            // Bottom info card
            if viewModel.showInfo, let part = viewModel.selectedPart {
                InfoCardView(part: part, onDismiss: viewModel.dismiss)
                    .padding(.horizontal, 12)
                    .padding(.bottom, 24)
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .bottom).combined(with: .opacity),
                            removal: .move(edge: .bottom).combined(with: .opacity)
                        )
                    )
                    .zIndex(1)
            }

            // Bottom hint overlay when nothing selected
            if !viewModel.showInfo {
                VStack {
                    Spacer()
                    HStack(spacing: 18) {
                        hintBadge(icon: "hand.tap.fill", text: "Tap a structure")
                        hintBadge(icon: "arrow.left.and.right", text: "Drag to rotate")
                        hintBadge(icon: "plus.magnifyingglass", text: "Pinch to zoom")
                    }
                    .padding(.bottom, 28)
                }
                .transition(.opacity)
            }
        }
        .background(Color(red: 0.04, green: 0.06, blue: 0.12))
        .preferredColorScheme(.dark)
        .animation(.easeInOut(duration: 0.25), value: viewModel.showInfo)
    }

    @ViewBuilder
    private func hintBadge(icon: String, text: String) -> some View {
        VStack(spacing: 5) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(.white.opacity(0.55))
            Text(text)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white.opacity(0.40))
        }
    }
}

#Preview {
    ContentView()
}
