---
name: LudoLeitura
colors:
  surface: '#f4faff'
  surface-dim: '#d0dce3'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eaf5fd'
  surface-container: '#e4f0f7'
  surface-container-high: '#deeaf2'
  surface-container-highest: '#d8e4ec'
  on-surface: '#121d23'
  on-surface-variant: '#4c4733'
  inverse-surface: '#273238'
  inverse-on-surface: '#e7f2fa'
  outline: '#7e7761'
  outline-variant: '#cfc6ac'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#fdd835'
  on-primary-container: '#715e00'
  inverse-primary: '#e8c41d'
  secondary: '#286b33'
  on-secondary: '#ffffff'
  secondary-container: '#abf4ac'
  on-secondary-container: '#2e7238'
  tertiary: '#006398'
  on-tertiary: '#ffffff'
  tertiary-container: '#bddeff'
  on-tertiary-container: '#00649a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16e'
  primary-fixed-dim: '#e8c41d'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#abf4ac'
  secondary-fixed-dim: '#90d792'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#07521d'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#94ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004b74'
  background: '#f4faff'
  on-background: '#121d23'
  surface-variant: '#d8e4ec'
typography:
  display-hero:
    fontFamily: Quicksand
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: 0.02em
  display-hero-mobile:
    fontFamily: Quicksand
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0.03em
  syllable-tile:
    fontFamily: Quicksand
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: 0.06em
  syllable-tile-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.05em
  title-md:
    fontFamily: Quicksand
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: 0.03em
  label-md:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system is tailored specifically for early childhood literacy, targeting children aged 4 to 8 who are learning phonemes, syllables, and word composition, alongside educators and parents guiding their learning.

The design movement combines **Tactile / Playful Skeuomorphism** with **Modern Soft Minimalism**:
- **Tactile & Interactive:** Buttons, syllabic cards, and interactive chips resemble smooth, physical wooden or soft-touch plastic building blocks. They evoke tactile delight through subtle, springy bottom-borders, soft cast shadows, and responsive micro-animations that reassure developing motor skills.
- **Friendly & Warm:** Rounded geometry, generous touch targets, and rhythmic cheerful palettes reduce cognitive strain, anxiety, and frustration in early readers.
- **Accessible & Clear:** High-contrast text overlays, distinct syllabic segmenting, and prominent audio triggers guarantee frictionless accessibility for emergent readers, including neurodiverse children.

## Colors

The palette uses warm, emotionally stimulating, and recognizable primary accents anchored over a crisp, calming background:

- **Primary Sun Yellow (`#FDD835`)**: The core interactive accent for primary buttons, focus highlights, and active phonemes. Paired with dark slate typography (`#273238`) for AA/AAA contrast.
- **Secondary Mint Leaf (`#81C784`)**: Associated with positive affirmation, success states, correct syllable matches, and encouraging progress badges.
- **Tertiary Sky Blue (`#64B5F6`)**: Applied to foundational structure tiles, sound-pronunciation actions, and navigation triggers.
- **Bubblegum Pink (`#F48FB1`) & Gentle Lilac (`#BA68C8`)**: Extended functional accents used across syllabic distinctions, gamified rewards, and category sorting.
- **Neutral Dark Canvas Text (`#273238`)**: Replaces pure harsh blacks with a warm, charcoal slate for optimal readability on pastel backdrops.
- **Surface Canvas (`#F8FAFC`)**: A soft off-white backdrop with cool undertones that minimizes glare and optical fatigue during reading sessions.

## Typography

The type system pairs **Quicksand** for prominent titles, syllable blocks, and interactive labels with **Nunito Sans** for instructional and secondary copy.

- **Legibility for Literacy:** Both font faces present open geometric apertures, clear distinction between confusing glyphs (such as lowercase 'l', uppercase 'I', and number '1'), and rounded terminal strokes that feel organic and approachable.
- **Syllable Tiles (`syllable-tile`):** Rendered uppercase with expanded tracking (`0.05em` to `0.06em`) to ensure clear visual separation between adjacent letters while sounding out words.
- **Instructional Body:** Set with generous line heights (`1.5` to `1.6`) to prevent visual crowding when children or guides read instructions on screen.

## Layout & Spacing

The layout utilizes a centered, fluid column structure with spacious safety margins to prevent accidental touch interactions on handheld tablets and smartphones:

- **Desktop & Large Tablets:** Centered 8-column layout with a maximum container width of `960px`, `1.25rem` gutters, and `2rem` outer page margins.
- **Mobile Handheld:** Single or dual-column adaptive layout with `1rem` margins and minimum touch target gaps of `0.75rem` (`12px`) to ensure small fingers do not trigger adjacent syllables simultaneously.
- **Vertical Rhythm:** Syllable word rows maintain a consistent gap of `space-lg` (`1.5rem`), providing ample isolation between individual words and phonetic units.

## Elevation & Depth

Visual hierarchy is created using tactile extruded surfaces and soft, tinted ambient drops rather than harsh, dark drop shadows:

- **Level 0 (Flat / Canvas):** Surface color `#F8FAFC` without elevation.
- **Level 1 (Syllable Cards & Audio Buttons):** Rendered with a solid bottom tactile edge `box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(39, 50, 56, 0.06)`. On active press (`:active`), the element shifts down `2px` and reduces bottom offset, creating a physical push-button feel.
- **Level 2 (Active Syllable / Focus Card):** Enhanced with a slight scale (`scale(1.04)`), an active color halo `0 0 0 4px #FDD835`, and a warm ambient blur `0 12px 24px -6px rgba(0, 0, 0, 0.12)`.
- **Level 3 (Modal Dialogs & Celebration Overlays):** Soft white or tinted surfaces with `0 20px 32px -8px rgba(39, 50, 56, 0.16)` overlaying a translucent, softened backdrop blur (`backdrop-filter: blur(6px)`).

## Shapes

The shape architecture relies heavily on generous pill and pebble-inspired silhouettes to reinforce safety, approachability, and fun:

- **Syllabic Tiles:** Use an ultra-rounded squircle profile (`border-radius: 1.5rem` / `24px` on mobile, `2rem` / `32px` on tablets/desktop), giving letter chunks the visual identity of candy drops or rounded wooden blocks.
- **Action Buttons & Audio Triggers:** Completely pill-shaped (`border-radius: 9999px`) or circular (`aspect-ratio: 1/1`) for audio speaker prompts.
- **Switch Toggles & Badges:** Full-pill geometry ensuring cohesive, friendly softness without sharp vertices anywhere in the learner's interactive path.

## Components

### Syllable Tiles (Phonetic Blocks)
- **Appearance:** Minimum touch area of `64px x 64px` on mobile and `80px x 80px` on desktop. Rendered with solid pastel background fills (Sun Yellow `#FDD835`, Mint Leaf `#81C784`, Sky Blue `#64B5F6`, Bubblegum `#F48FB1`).
- **Typography:** Bold uppercase syllable rendered in `syllable-tile` style with neutral `#273238`.
- **Feedback:** Tapping a syllable triggers immediate audio playback, a gentle pop scale animation (`1.05`), and a momentary bottom edge deflection.

### Audio Action Button (Speaker Button)
- **Appearance:** Floating circular button (`48px x 48px` minimum), resting beside the syllable groups. Background is neutral surface white (`#FFFFFF`) with a delicate slate border (`rgba(39, 50, 56, 0.08)`) and soft shadow.
- **Icon:** Friendly, rounded 2-wave speaker megaphone icon with cheerful slate or blue stroke.
- **Interaction:** Plays the entire assembled word in complete context with an active wave ripple animation.

### Mode Toggles (e.g., "Destacar sílabas")
- **Appearance:** Pill-shaped track (`52px x 30px`) with a floating thumb (`24px`). Active state uses vibrant primary blue (`#42A5F5`) or yellow (`#FBC02D`) with clear, rounded status text adjacent.

### Word Cards & Lists
- **Structure:** Words are organized in horizontal rows of grouped syllable tiles followed by their respective audio trigger, aligned centered in a fluid column with ample spacing (`space-lg`) between words to aid ocular scanning.
- **Grouping:** Individual words are contained in subtle, ultra-rounded transparent cards or directly on the clean canvas with soft row separators.

### Reward Badges & Star Trackers
- **Appearance:** Pebble-shaped containers with pastel gradients, star counters, and celebration icons to provide instant gamified positive reinforcement after a series of successful syllable readings.