export type Category = 'All' | 'Games' | 'Code' | '3D' | 'Motion'
export type Project = {
  id: string
  title: string
  category: Exclude<Category, 'All'>
  subtitle: string
  description: string
  stack: string[]
  links: { label: string; href: string }[]
  image?: string
  images?: string[]
  role?: string
}

export const projects: Project[] = [
  { id: 'atelier', title: 'Quiet Corner', category: '3D', subtitle: 'Interior study · Blender', description: 'An interior study of a quiet living space, with upholstered linen seating, oak paneling, a limestone table and an olive tree. The work explores daylight, material detail and the composition of everyday objects.', role: 'Interior composition, furniture modeling, material development, daylight, camera animation and rendering.', stack: ['Blender', 'Cycles', 'glTF'], image: '/studies/quiet-corner.webp', links: [{ label: 'Download 3D model', href: '/studies/quiet-corner.glb' }, { label: 'Blender source', href: '/studies/quiet-corner.blend' }] },
  { id: 'dirty', title: 'Dirty Birdy!', category: 'Games', subtitle: 'Mobile arcade · ZargasLabs', description: 'A mobile arcade game with quick sessions and score-based progression. My work covers gameplay systems, interface implementation and performance on mobile devices.', stack: ['Unity', 'C#', 'Android', 'iOS'], image: '/portfolio/dirty-birdy-1.jpg', images: ['/portfolio/dirty-birdy-1.jpg', '/portfolio/dirty-birdy-2.jpg'], links: [{ label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.moonlight.dirtybirdy' }, { label: 'App Store', href: 'https://apps.apple.com/tr/app/dirty-birdy/id6747272308' }] },
  { id: 'juggle', title: 'Juggle Trap', category: 'Games', subtitle: 'Reflex arcade · ZargasLabs', description: 'A one-tap arcade game built around laser obstacles, timing and score progression, with unlockable cosmetics and mobile controls.', stack: ['Unity', 'C#', 'Android', 'iOS'], image: '/portfolio/juggle-trap-1.jpg', images: ['/portfolio/juggle-trap-1.jpg', '/portfolio/juggle-trap-2.jpg'], links: [{ label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.zargaslabs.juggletrap' }, { label: 'App Store', href: 'https://apps.apple.com/tr/app/juggle-trap-laser-dodge/id6760250230' }] },
  { id: 'blender', title: 'BlenderMCP', category: 'Code', subtitle: 'Python · Desktop tooling', description: 'A local bridge for Blender scene creation, materials, lighting, rendering and model exports. Designed for local scene and asset workflows.', stack: ['Python', 'Blender', 'MCP'], links: [{ label: 'View repository', href: 'https://github.com/Remirdy/BlenderMCP' }] },
  { id: 'photoshop', title: 'PhotoshopMCP', category: 'Code', subtitle: 'TypeScript · Desktop tooling', description: 'Tools for working with Photoshop documents, editable layers and asset exports through a local integration.', stack: ['TypeScript', 'Photoshop', 'MCP'], links: [{ label: 'View repository', href: 'https://github.com/Remirdy/PhotoshopMCP' }] },
  { id: 'aftereffects', title: 'AfterEffectsMCP', category: 'Code', subtitle: 'TypeScript · Motion tooling', description: 'An After Effects integration for composition and animation workflows, including keyframes and render preparation.', stack: ['TypeScript', 'After Effects', 'MCP'], links: [{ label: 'View repository', href: 'https://github.com/Remirdy/AfterEffectsMCP' }] },
  { id: 'umay', title: 'UmayOS', category: 'Code', subtitle: 'C · Systems programming', description: 'An educational operating system kernel for 32-bit RISC-V, with preemptive multitasking. A project for exploring low-level programming and operating system fundamentals.', stack: ['C', 'RISC-V', 'Operating systems'], links: [{ label: 'View repository', href: 'https://github.com/Remirdy/UmayOS' }] },
  { id: 'ecoquest', title: 'EcoQuest', category: 'Code', subtitle: 'Kotlin · Android', description: 'An Android application project built with Kotlin.', stack: ['Kotlin', 'Android'], links: [{ label: 'View repository', href: 'https://github.com/Remirdy/EcoQuest' }] },
  { id: 'raycaster', title: 'raycaster-c', category: 'Code', subtitle: 'C · Graphics programming', description: 'A raycasting project in C, exploring the foundations of real-time graphics.', stack: ['C', 'Raycasting'], links: [{ label: 'View repository', href: 'https://github.com/Remirdy/raycaster-c' }] },
  { id: 'motion', title: 'Motion Design', category: 'Motion', subtitle: 'Experience · Metraj Production', description: 'At Metraj Production, I animated prepared Photoshop layouts in After Effects. My responsibilities included layer animation, timing, parallax, camera movement, transitions and production revisions.', role: 'Animation of supplied visual designs, from layered PSD files to finished motion outputs.', stack: ['After Effects', 'Photoshop'], links: [{ label: 'Read about my work', href: '/motion' }] },
]
