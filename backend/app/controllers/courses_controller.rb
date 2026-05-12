class CoursesController < ApplicationController
  # Pipeline de before_action: o Rails executa esses filtros em ordem antes de cada ação.
  # authenticate_request! vem do ApplicationController e bloqueia quem não tem JWT válido.
  # set_course carrega o @course uma vez e compartilha entre show, update e destroy.
  # authorize_creator! só faz sentido após set_course, por isso vem depois.
  before_action :authenticate_request!, only: [:create, :update, :destroy]
  before_action :set_course,            only: [:show, :update, :destroy]
  before_action :authorize_creator!,    only: [:update, :destroy]

  # GET /courses
  def index
    # includes(:creator) faz eager loading: busca os criadores em uma única query SQL.
    courses = Course.includes(:creator).all
    render json: courses.map { |c| course_json(c) }
  end

  # GET /courses/:id
  def show
    # Mescla os dados do curso com suas aulas para evitar uma segunda requisição do frontend.
    render json: course_json(@course).merge(lessons: @course.lessons.map { |l| lesson_json(l) })
  end

  # POST /courses
  def create
    # build é equivalente a Course.new, mas já associa creator_id ao @current_user automaticamente.
    course = @current_user.courses.build(course_params)
    if course.save
      render json: course_json(course), status: :created
    else
      # errors.full_messages retorna um array com as mensagens de validação do model.
      render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /courses/:id
  def update
    if @course.update(course_params)
      render json: course_json(@course)
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /courses/:id
  def destroy
    @course.destroy
    head :no_content # Retorna 204: sucesso sem corpo de resposta.
  end

  private

  #----------Filtros----------

  def set_course
    @course = Course.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    # find levanta uma exceção se não encontrar; o rescue evita que o Rails retorne 500.
    render json: { error: "Curso não encontrado" }, status: :not_found
  end

  def authorize_creator!
    # Garante que apenas o dono do curso possa alterá-lo ou excluí-lo.
    unless @course.creator_id == @current_user.id
      render json: { error: "Sem permissão" }, status: :forbidden
    end
  end

  #----------Params e Serialização----------

  def course_params
    # Strong Parameters: lista explícita do que o usuário pode enviar.
    # Campos fora dessa lista são ignorados silenciosamente pelo Rails.
    params.require(:course).permit(:name, :description, :start_date, :end_date)
  end

  def course_json(course)
    # Serialização
    {
      id:          course.id,
      name:        course.name,
      description: course.description,
      start_date:  course.start_date,
      end_date:    course.end_date,
      creator_id:  course.creator_id,
      creator:     { id: course.creator.id, name: course.creator.name }
    }
  end

  def lesson_json(lesson)
    # Usa no show
    {
      id:        lesson.id,
      title:     lesson.title,
      status:    lesson.status,
      video_url: lesson.video_url,
      course_id: lesson.course_id
    }
  end
end
