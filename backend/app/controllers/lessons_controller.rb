class LessonsController < ApplicationController
  # Todas as ações de aula exigem login.
  # set_course vem antes de authorize_creator! porque a autorização depende do @course.
  # set_lesson é carregado apenas nas ações que precisam de uma aula específica.
  before_action :authenticate_request!
  before_action :set_course
  before_action :authorize_creator!
  before_action :set_lesson, only: [:update, :destroy]

  # POST /courses/:course_id/lessons
  def create
    # build associa lesson ao @course automaticamente via course_id.
    lesson = @course.lessons.build(lesson_params)
    if lesson.save
      render json: lesson_json(lesson), status: :created
    else
      render json: { errors: lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /courses/:course_id/lessons/:id
  def update
    if @lesson.update(lesson_params)
      render json: lesson_json(@lesson)
    else
      render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /courses/:course_id/lessons/:id
  def destroy
    @lesson.destroy
    head :no_content # 204: sucesso sem corpo de resposta.
  end

  private

  #----------Filtros----------

  def set_course
    # Usa :course_id (não :id) porque a rota é aninhada: /courses/:course_id/lessons/:id.
    @course = Course.find(params[:course_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Curso não encontrado" }, status: :not_found
  end

  def set_lesson
    # Busca a aula pelo escopo do curso para evitar que alguém acesse aulas de outro curso.
    @lesson = @course.lessons.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Aula não encontrada" }, status: :not_found
  end

  def authorize_creator!
    # Somente o criador do curso gerencia suas aulas.
    unless @course.creator_id == @current_user.id
      render json: { error: "Sem permissão" }, status: :forbidden
    end
  end

  #----------Params e Serialização----------

  def lesson_params
    params.require(:lesson).permit(:title, :status, :video_url)
  end

  def lesson_json(lesson)
    {
      id:        lesson.id,
      title:     lesson.title,
      status:    lesson.status,
      video_url: lesson.video_url,
      course_id: lesson.course_id
    }
  end
end
