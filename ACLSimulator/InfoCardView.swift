import SwiftUI

struct InfoCardView: View {
    let part: AnatomyPart
    let onDismiss: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Handle bar
            HStack {
                Spacer()
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color.white.opacity(0.25))
                    .frame(width: 40, height: 5)
                Spacer()
            }
            .padding(.top, 10)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Category badge + name
                    HStack(alignment: .top, spacing: 12) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(part.category.rawValue.uppercased())
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(Color(part.accentColor))
                                .tracking(2.0)
                                .padding(.horizontal, 9)
                                .padding(.vertical, 4)
                                .background(Color(part.accentColor).opacity(0.15))
                                .clipShape(Capsule())

                            Text(part.name)
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.white)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        Spacer()
                        Button(action: onDismiss) {
                            Image(systemName: "xmark")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.white.opacity(0.6))
                                .frame(width: 30, height: 30)
                                .background(Color.white.opacity(0.10))
                                .clipShape(Circle())
                        }
                    }

                    // Accent divider
                    Rectangle()
                        .fill(
                            LinearGradient(
                                colors: [Color(part.accentColor), Color(part.accentColor).opacity(0)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(height: 1.5)

                    // Short description
                    Text(part.shortDescription)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(part.accentColor).opacity(0.9))
                        .fixedSize(horizontal: false, vertical: true)

                    // Full description
                    Text(part.fullDescription)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(Color.white.opacity(0.72))
                        .lineSpacing(5)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
            }
            .frame(maxHeight: 320)
        }
        .background(
            ZStack {
                Color(red: 0.07, green: 0.10, blue: 0.18)
                // Subtle top gradient tint
                LinearGradient(
                    colors: [Color(part.accentColor).opacity(0.08), Color.clear],
                    startPoint: .top,
                    endPoint: .center
                )
            }
        )
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(Color.white.opacity(0.08), lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.6), radius: 30, x: 0, y: -8)
    }
}

// MARK: - Part Label Chip (shown floating on the 3D view when selected)
struct PartLabelChip: View {
    let name: String
    let color: UIColor

    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(Color(color))
                .frame(width: 7, height: 7)
            Text(name)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial)
        .clipShape(Capsule())
        .overlay(Capsule().stroke(Color.white.opacity(0.15), lineWidth: 1))
    }
}
