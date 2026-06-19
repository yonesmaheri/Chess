# UI Reverse Engineering Specification — Chessify Authentication Page

## 1. Overall Layout Structure

### Page Type

**Authentication page**

Purpose:

* User registration
* User login switch
* OAuth signup

This is not a dashboard. It is a centered auth flow with a premium chess-themed background.

---

## Full Page Hierarchy

```text
AuthPage
│
├── Background Layer
│   ├── Chess board pattern
│   ├── Chess piece decorations
│   └── Soft gradients
│
├── Brand Header
│   ├── Chess icon logo
│   ├── CHESSIFY text
│   └── Persian tagline
│
└── Auth Card
    │
    ├── Tabs
    │   ├── Register
    │   └── Login
    │
    ├── Form Header
    │
    ├── Input Fields
    │   ├── Username
    │   ├── Email
    │   └── Password
    │
    ├── Submit Button
    │
    ├── Divider
    │
    ├── Google OAuth Button
    │
    └── Terms Text
```

---

# Layout Container

## Full viewport

```css
height:100vh;
min-height:900px;
```

Centered vertically and horizontally.

---

## Main Auth Wrapper

Approx:

```
width: 100%
display:flex
justify-content:center
align-items:center
```

---

## Card Position

Center aligned.

Estimated:

```css
width: 675px;
```

Height:

```css
~980px
```

---

## Spacing System

Uses 8px grid.

Main gaps:

```
16px
24px
32px
40px
48px
```

---

# Background Analysis

## Base Background

Very soft warm white.

Approx:

```css
#FAF8F3
```

---

## Chess Board Background

Large chess board grid.

Position:

Full page.

Opacity:

Very low.

Approx:

```css
opacity:0.05 - 0.08
```

---

Pattern:

Squares:

```text
light square
dark square
light square
dark square
```

No hard contrast.

---

## Decorative Pieces

Transparent chess pieces:

Left:

* Knight silhouette

Right:

* Pawn

Bottom:

* Rook

Opacity:

```css
0.04 - 0.07
```

Color:

```css
#8C8C8C
```

---

# 2. Header Analysis

No navigation header.

Instead:

## Brand Header

Located top center.

---

Structure:

```
      ♟
   CHESSIFY
  جای برای ذهن‌های استراتژیک
```

---

## Logo Icon

Chess knight / rook style.

Size:

Approx:

```css
48px
```

Color:

Dark charcoal.

---

## Brand Text

"CHESSIFY"

Font:

Modern uppercase sans.

Size:

```css
28px
```

Weight:

500

Letter spacing:

Large:

```css
4px
```

---

## Tagline

Persian.

Size:

```css
14px
```

Color:

```css
#8A8A8A
```

---

# 3. Main Content

## Component

```
AuthCard
```

---

## Card Container

Dimensions:

Approx:

```
width:675px
```

Padding:

```css
40px 48px
```

---

## Card Style

Background:

Almost transparent white.

```css
rgba(255,255,255,0.75)
```

---

Border:

```css
1px solid rgba(220,220,220,.8)
```

---

Radius:

Large rounded.

Approx:

```css
24px
```

---

Shadow:

Soft:

```css
0 20px 60px rgba(0,0,0,.08)
```

---

Possible glass effect:

```css
backdrop-filter: blur(12px)
```

---

# Tabs Component

## Layout

Two columns:

```
ثبت‌نام | ورود
```

RTL.

---

Height:

```css
60px
```

---

Each tab:

width:

50%

---

Active:

Register.

Underline:

Black line.

Position:

bottom.

Height:

```css
3px
```

---

Inactive:

Gray.

---

Typography:

Size:

```css
18px
```

Weight:

600

---

# Form Header

Title:

```
عضویت در چسیفای
```

---

Size:

```css
28px
```

Weight:

700

Color:

```css
#292B32
```

---

Subtitle:

```
برای شروع، اطلاعات خود را وارد کنید.
```

Size:

15px

Color:

```css
#8C8C8C
```

---

# Inputs

Component:

```
AuthInput
```

---

## Structure

RTL.

```
label

input
    placeholder
    icon
```

---

## Width

Full card width.

Approx:

```css
100%
```

---

## Height

```css
60px
```

---

## Border

```css
1px solid #E2E2E2
```

---

Radius:

```css
12px
```

---

Background:

Transparent.

---

## Input Text

Size:

```css
15px
```

---

Placeholder:

```css
#B5B5B5
```

---

## Icons

Right side:

* User
* Mail
* Lock

Password:

left:

Eye icon.

---

Icons:

Stroke style.

Size:

```css
22px
```

Color:

```css
#9B9B9B
```

---

# Form Spacing

Between fields:

```css
24px
```

---

Labels:

Size:

```css
15px
```

Weight:

500

Margin bottom:

8px

---

# Submit Button

## Primary Button

Full width.

Height:

```css
64px
```

---

Background:

Dark charcoal.

Approx:

```css
#292D32
```

---

Radius:

```css
12px
```

---

Text:

white

Size:

18px

Weight:

600

---

Hover:

```css
background:#1F2327
```

---

# Divider

Structure:

```
line —— یا —— line
```

---

Margin:

```css
32px 0
```

---

Line:

```css
#E8E8E8
```

---

Text:

Gray.

Size:

14px

---

# Google Button

## OAuth Button

Height:

```css
60px
```

---

Border:

```css
#E1E1E1
```

---

Radius:

```css
12px
```

---

Layout:

RTL:

```
Google icon
ثبت‌نام با گوگل
```

---

Google logo:

24px.

---

# Terms Text

Bottom.

Centered.

Text:

```
با ثبت‌نام، شما با شرایط استفاده و سیاست حریم خصوصی موافقت می‌کنید.
```

---

Size:

```css
13px
```

Color:

```css
#999999
```

---

Links:

Underline.

---

# 4. Typography System

Likely font:

* Vazirmatn
* Dana
* IRANSansX

---

## Scale

### Brand

```css
28px
500
```

---

### Page title

```css
28px
700
line-height:1.4
```

---

### Tab

```css
18px
600
```

---

### Label

```css
15px
500
```

---

### Body

```css
15px
400
line-height:2
```

---

### Button

```css
18px
600
```

---

# 5. Color System

## Primary

Dark charcoal:

```
#292D32
```

Usage:

* Submit button
* Active underline
* Main text

---

## Background

Warm white:

```
#FAF8F3
```

---

## Surface

Card:

```
#FFFFFFCC
```

---

## Border

```
#E4E2DE
```

---

## Text

Main:

```
#292D32
```

---

Muted:

```
#888888
```

---

Placeholder:

```
#B8B8B8
```

---

# 6. Component Styling Details

## AuthCard

```css
width:675px;
padding:48px;
border-radius:24px;
```

---

## Input

```css
height:60px;
border-radius:12px;
padding:0 18px;
```

---

## Buttons

Primary:

```css
height:64px;
border-radius:12px;
```

Secondary:

```css
height:60px;
border-radius:12px;
```

---

# 7. Border Radius Language

Design:

**Soft minimal glass UI**

Values:

```
small:
8px

medium:
12px

large:
24px

pill:
999px
```

---

# 8. Effects

## Glass

Card:

```css
backdrop-filter:blur(16px)
```

---

## Shadow

Soft elevation:

```css
0 25px 70px rgba(0,0,0,.08)
```

---

## Background Blur

Chess pieces:

blurred.

---

## Animations

Expected:

Input focus:

* border darkens
* slight transition

Tabs:

underline transition.

---

# 9. Footer Analysis

No footer.

Only legal text inside auth card.

---

# 10. Responsive Implementation

## Desktop

> =1024

```
center card
675px
```

---

## Tablet

768-1024

Card:

```css
width:90%;
```

---

## Mobile

<768

Card:

```css
width:calc(100% - 32px)
```

Padding:

```css
24px
```

Logo scales:

48 → 40px

Inputs:

full width.

---

# 11. Implementation Specification

با استراکچر feature-based قبلی:

```bash
src/

features/
│
└── auth/
    │
    ├── components/
    │
    ├── RegisterForm/
    │   ├── RegisterForm.tsx
    │   ├── AuthTabs.tsx
    │   ├── AuthInput.tsx
    │   ├── OAuthButton.tsx
    │   └── TermsText.tsx
    │
    ├── LoginForm/
    │
    ├── AuthCard/
    │   └── AuthCard.tsx
    │
    ├── assets/
    │   ├── chess-bg.svg
    │   └── logo.svg
    │
    └── constants.ts


shared/

components/

├── ui/
│
├── Input/
├── Button/
├── Card/
└── IconBox/
```

---

## Page Composition

```tsx
app/(auth)/register/page.tsx
```

```tsx
<AuthLayout>

<AuthBrand />

<AuthCard>

<AuthTabs />

<RegisterForm />

</AuthCard>

</AuthLayout>
```

---

## Required Components

```
AuthLayout
AuthCard
AuthTabs
AuthInput
PasswordInput
SubmitButton
OAuthButton
TermsText
ChessBackground
BrandLogo
```

---

## Required Icons

Lucide:

```
UserRound
Mail
Lock
Eye
EyeOff
```

Custom:

```
ChessKnight
GoogleLogo
```

---

## CSS Tokens

```css
:root{

--auth-bg:#FAF8F3;

--surface:#FFFFFFCC;

--text:#292D32;

--muted:#888;

--border:#E4E2DE;

--radius-card:24px;

--radius-input:12px;

--shadow-auth:
0 25px 70px rgba(0,0,0,.08);

}
