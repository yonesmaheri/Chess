import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../shared/prisma.service';
import {
  CourseSortOption,
  ListCoursesQueryDto,
} from './dto/list-courses-query.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCoursesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 6;
    const skip = (page - 1) * limit;
    const trimmedSearch = query.search?.trim();

    const where: Prisma.CourseWhereInput = {
      isPublished: true,
    };

    if (query.level) {
      where.level = query.level;
    }

    if (query.category) {
      where.category = {
        slug: query.category,
      };
    }

    if (trimmedSearch) {
      where.OR = [
        {
          title: {
            contains: trimmedSearch,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: trimmedSearch,
            mode: 'insensitive',
          },
        },
        {
          instructor: {
            name: {
              contains: trimmedSearch,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const orderBy = this.getOrderBy(query.sort);
    const [courses, totalItems] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          instructor: true,
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnailImage: course.thumbnailImage,
        previewVideoUrl: course.previewVideoUrl,
        level: course.level,
        category: {
          id: course.category.id,
          name: course.category.name,
          slug: course.category.slug,
        },
        instructor: {
          id: course.instructor.id,
          name: course.instructor.name,
          avatarImage: course.instructor.avatarImage,
        },
        rating: course.rating,
        reviewCount: course.reviewCount,
        studentCount: course.studentCount,
        duration: course.duration,
        totalLessons: course.totalLessons,
        price: course.price,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })),
      totalItems,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    };
  }

  async findOne(identifier: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        isPublished: true,
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        instructor: true,
        chapters: {
          orderBy: {
            order: 'asc',
          },
          include: {
            lessons: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailImage: course.thumbnailImage,
      previewVideoUrl: course.previewVideoUrl,
      level: course.level,
      category: {
        id: course.category.id,
        name: course.category.name,
        slug: course.category.slug,
      },
      instructor: {
        id: course.instructor.id,
        name: course.instructor.name,
        bio: course.instructor.bio,
        avatarImage: course.instructor.avatarImage,
      },
      rating: course.rating,
      reviewCount: course.reviewCount,
      studentCount: course.studentCount,
      duration: course.duration,
      totalLessons: course.totalLessons,
      price: course.price,
      isPublished: course.isPublished,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      curriculum: course.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.order,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          order: lesson.order,
          isPreview: lesson.isPreview,
        })),
      })),
      reviews: course.reviews.map((review) => ({
        id: review.id,
        authorName: review.authorName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    };
  }

  private getOrderBy(
    sort?: CourseSortOption,
  ):
    | Prisma.CourseOrderByWithRelationInput
    | Prisma.CourseOrderByWithRelationInput[] {
    switch (sort) {
      case CourseSortOption.popular:
        return { studentCount: 'desc' };
      case CourseSortOption.rating:
        return [{ rating: 'desc' }, { reviewCount: 'desc' }];
      case CourseSortOption.newest:
      default:
        return { createdAt: 'desc' };
    }
  }
}
