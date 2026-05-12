export interface Lesson {
  id: number
  title: string
  status: 'draft' | 'published'
  video_url: string
  course_id: number
}

export interface Course {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  creator_id: number
  creator: { id: number; name: string }
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[]
}
