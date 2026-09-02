// GradientBackground — "Bloom Field gradient", made with the 21st.dev Gradient
// Builder and exported as live CSS (the builder's own Copy-CSS background,
// plus its soften-blur and grain passes). Zero dependencies: one <div> that
// fills its parent. Drop it behind your content:
// <div className="relative h-96"><GradientBackground className="absolute inset-0" /></div>
// Remix the source recipe (colors, mode, finish) in the editor:
// https://21st.dev/community/gradients/editor?from=fba2fa02-eb4c-49d4-8490-8d69c5c0baf7
//
// Warna radial di sini pakai nuansa biru (base biru muda + biru tua +
// biru vivid + biru langit), sesuai request user.
export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        overflow: "hidden",
        containerType: "size",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#eaf6ff",
          backgroundImage:
            "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.450'/></svg>\"), radial-gradient(ellipse at 67.04% 45.93%, rgba(234, 246, 255, 1) 0%, rgba(234, 246, 255, 0.844) 19.02%, rgba(234, 246, 255, 0.5) 38.05%, rgba(234, 246, 255, 0.156) 57.07%, rgba(234, 246, 255, 0) 76.1%), radial-gradient(ellipse at 35.47% 65.92%, rgba(30, 64, 175, 1) 0%, rgba(30, 64, 175, 0.844) 12.9%, rgba(30, 64, 175, 0.5) 25.8%, rgba(30, 64, 175, 0.156) 38.7%, rgba(30, 64, 175, 0) 51.6%), radial-gradient(ellipse at 48.33% 20.11%, rgba(37, 99, 235, 1) 0%, rgba(37, 99, 235, 0.844) 16.75%, rgba(37, 99, 235, 0.5) 33.5%, rgba(37, 99, 235, 0.156) 50.25%, rgba(37, 99, 235, 0) 67%), radial-gradient(ellipse at 80.81% 88.03%, rgba(96, 165, 250, 1) 0%, rgba(96, 165, 250, 0.844) 10.28%, rgba(96, 165, 250, 0.5) 20.55%, rgba(96, 165, 250, 0.156) 30.83%, rgba(96, 165, 250, 0) 41.1%)",
          backgroundSize: "120px 120px, auto, auto, auto, auto",
          backgroundBlendMode: "overlay, normal, normal, normal, normal",
        }}
      />
    </div>
  );
}
