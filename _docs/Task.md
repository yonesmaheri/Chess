Now implement the backend for this course listing page.

The frontend already exists. Create a complete backend system to provide dynamic course data instead of static data.

Requirements:

## Backend Features

Build a REST API for courses.

Each course should have:

- id
- title
- slug
- description
- thumbnail image
- preview video URL
- level
  - beginner
  - intermediate
  - advanced

- category/topic
- instructor
- instructor avatar
- rating
- review count
- student count

- duration
- total lessons
- price
- isPublished
- createdAt
- updatedAt


## Course API

Create endpoints:


GET /courses

Features:
- return paginated courses
- default pagination:
  page=1
  limit=6

Response should include:
- courses
- total items
- current page
- total pages


Support filters:

GET /courses?level=beginner

GET /courses?category=tactics


Support sorting:

GET /courses?sort=popular

Options:
- newest
- popular
- rating


Support search:

GET /courses?search=شطرنج


Search should work on:
- title
- description
- instructor name


---

GET /courses/:id

Return full course details:

- course information
- instructor information
- curriculum
- lessons
- reviews


---

## Course Structure

A course contains chapters.

Create:

Chapter:
- id
- title
- order
- courseId


Lesson:
- id
- title
- duration
- videoUrl
- order
- chapterId
- isPreview


Example:

Course:
"استاد تاکتیک در شطرنج"

Chapters:
1. مبانی تاکتیک
2. تاکتیک‌های ترکیبی
3. فداکاری‌ها


Each chapter contains lessons.


---

## Database

Create database models for:

Course
Chapter
Lesson
Instructor
Review
Category


Relations:

Course:
has many Chapters

Chapter:
has many Lessons

Course:
belongs to Instructor

Course:
has many Reviews


---

## Admin Features

Create admin APIs:

POST /courses

Create course


PATCH /courses/:id

Update course


DELETE /courses/:id

Delete course


POST /courses/:id/publish

Publish/unpublish course


POST /courses/:id/chapters

Add chapter


POST /chapters/:id/lessons

Add lesson


---

## Authentication

Add authentication system:

- User registration
- Login
- JWT authentication

Roles:

USER
ADMIN


Only ADMIN can:
- create courses
- edit courses
- delete courses
- manage lessons


---

## Image Upload

Implement image upload support:

Course thumbnail upload

Instructor avatar upload

Store:
- image URL
- file metadata


---

## Validation

Add request validation:

- required fields
- correct data types
- prevent empty titles
- validate URLs


---

## Seed Data

Create initial seed data matching the UI:

Create 6 courses:

1.
اصول و مبانی شطرنج

2.
ساختار پیاده‌ها

3.
ابتکار عمل در شطرنج

4.
تاکتیک‌های ضروری

5.
ترکیب حمله و استراتژی

6.
چهار اصل استراتژیک


Add realistic instructors, ratings and lessons.


---

## Performance

Add:
- database indexes for search fields
- optimized queries
- pagination
- caching where useful


The frontend should be able to consume these APIs and render the exact course cards dynamically.