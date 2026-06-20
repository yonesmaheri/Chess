You are a senior frontend engineer and UI/UX designer.

Recreate this dashboard page from the provided screenshot with pixel-level accuracy.

The page is a Persian (RTL) chess learning platform dashboard. Implement it as a modern responsive web application.

## General Design Requirements

- Direction: RTL (right-to-left)
- Language: Persian
- Layout style: clean SaaS dashboard
- Theme: minimal, elegant, soft glassmorphism
- Background: very light gray/white (#fafafa)
- Main accent color: muted sage green (#7f9f85)
- Text color: dark charcoal (#252a2e)
- Secondary text: soft gray (#8a8f94)
- Borders: very subtle gray (#e7e9e8)
- Cards have:
  - white background
  - thin border
  - rounded corners (14-18px)
  - very soft shadow
- Typography:
  - Persian modern font similar to Vazirmatn / IRANSans
  - clear hierarchy
- Use lots of whitespace

---

# Overall Layout

Create a full dashboard shell:

Desktop layout:

- Right side fixed sidebar navigation
- Main content area in the center
- Left side learning progress panel

The whole page should look like a 3-column dashboard:

------------------------------------
| Left progress | Main dashboard | Right sidebar |
------------------------------------

Height:
Full viewport

Rounded outer container with margin around the page.

---

# Right Sidebar Navigation

Position:
Fixed right vertical sidebar.

Width:
~110px

Design:

White background
Left border separating from content
Rounded corners

Top section:

Chess knight logo/icon in sage green.

Under it:
Brand name:
"شطرنج"

Navigation items vertically:

Each item contains:
- icon
- Persian label

Items:

خانه
(icon: home)

بازی
(icon: grid)

درس‌ها
(icon: book)

تمرینات
(icon: target)

پیشرفت
(icon: chart)
(active state)

جامعه
(icon: users)

پیام‌ها
(icon: message)

تنظیمات
(icon: settings)

Bottom:
Logout icon + text

Active item:

Rounded green background
white icon
white text

---

# Top Header Area

Main content top:

Right aligned title:

"پیشرفت و تحلیل"

Subtitle:

"عملکرد خود را بررسی کنید و نقاط قوت خود را تقویت کنید."

Top left:

Date selector button:

Rounded rectangle

Calendar icon

Text:

"۳۰ روز گذشته"

Dropdown arrow

---

# User Profile Card

Large horizontal card.

Position:
Top center.

Contains:

Right side:

Circular avatar image

User information:

Name:
"آرمان رضایی"

Text:
"عضو از فروردین ۱۴۰۲"

Below:

"سطح بعدی: 1300"

Left side:

Current level section:

Chess knight icon

Number:
1200

Text:
"سطح فعلی"

Progress:

XP:

12,450 / 20,000

Horizontal progress bar

Green filled section

---

# Statistics Cards Row

Create 4 equal cards.

Each card:

Rounded border card

Height around 130px


Card 1:

Title:
"بازی‌های انجام شده"

Icon:
Chess pawn

Value:
86

Bottom:
Green upward arrow

"12% نسبت به قبل"


Card 2:

Title:
"بردها"

Icon:
Trophy

Value:
54

Bottom:
"62% نرخ برد"


Card 3:

Title:
"دقت تاکتیکی"

Icon:
Target

Value:
72%

Bottom:
"نسبت به قبل ↑"


Card 4:

Title:
"درس‌های تکمیل شده"

Icon:
Book

Value:
28

Bottom:
"نسبت به قبل ↑"


---

# Main Analytics Section

Create two columns:

Left:
Large charts area

Right:
Recent activity panel


---

# Rating Growth Chart Card

Title:

"رشد ریتینگ (ELO)"

Top right icon:
small chart icon


Top left:
Dropdown:

"نمودار خطی"


Chart:

Line chart.

Style:

- green line
- soft green gradient under the line
- grid background
- rounded container


Y axis:

600
800
1000
1200
1400


X axis:

۳۰ فروردین
۶ اردیبهشت
۱۳ اردیبهشت
۲۰ اردیبهشت
۲۷ اردیبهشت


Current point:

1200

Floating tooltip:

"1200 امروز"


---

# Recent Activity Panel

Right side card.

Title:

"فعالیت‌های اخیر"


List items:

Each item:

Icon box
Text
Date
Divider


Examples:

1.

"بازی مقابل مهران کاظمی"
Result:
برد


2.

"تکمیل درس تاکتیک‌های بین"
Reward:
+150 XP


3.

"بازی مقابل سارا محمدی"
Result:
باخت


4.

"تکمیل درس ترکیب‌های مات"
Reward:
+200 XP


5.

"بازی مقابل رضا یوسفی"
Result:
برد


Bottom button:

"مشاهده همه فعالیت‌ها"

Rounded outline button

---

# Skill Analysis Radar Card

Below chart:

Card title:

"تحلیل مهارت‌ها"


Show radar chart.

Categories:

تاکتیک
استراتژی
پایان بازی
محاسبه
گشودن‌ها
مدیریت زمان


Values:

72
68
55
65
60
70


Chart style:

- green filled polygon
- transparent area
- dotted comparison line


Legend:

"شما"

and

"میانگین بازیکنان هم‌سطح"


---

# Left Learning Progress Panel

Vertical card.

Title:

"مسیر یادگیری"

Icon:
map icon


Vertical roadmap.

Steps:

مبتدی
subtitle:
"مفاهیم پایه شطرنج"

checked

سباز
subtitle:
"حرکت‌های پایه"

checked

اسب
subtitle:
"تاکتیک‌های ابتدایی"

checked

فیل
subtitle:
"استراتژی‌های پایه"

checked

رخ
subtitle:
"ترکیب‌های پیشرفته"

active state

وزیر
locked

شاه
locked


Use:

dashed connecting line

Circular nodes

Green completed states

Gray locked states


---

# Bottom Goal Card

Inside left panel:

Card:

Title:

"هدف بعدی"

Icon:
target


Text:

"تکمیل درس‌های ترکیب‌های پیشرفته"

Progress:

"6 از 12 درس"

Green progress bar


---

# Responsive Behavior

Desktop:
3 column layout

Tablet:
Hide left progress panel
Sidebar becomes smaller

Mobile:

- Sidebar becomes bottom navigation
- Cards stack vertically
- Charts become full width

---

# Components Structure

Create reusable components:

DashboardLayout
Sidebar
TopHeader
ProfileCard
StatCard
LearningPath
ProgressGoal
RatingChart
ActivityList
SkillRadar


Use clean component architecture.

Use modern React + TypeScript.

Use TailwindCSS.

Use shadcn/ui style components.

Use Lucide icons.

Charts can use Recharts.

Match spacing, colors, borders and typography exactly.