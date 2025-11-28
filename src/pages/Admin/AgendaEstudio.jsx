import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect, useMemo } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown, Building, Plus, X, Pencil } from 'lucide-react';
import api from '../../services/api';

const STUDIO_MAP = {
    1: 'Estudio Itaquera',
    2: 'Estudio São Miguel',
};

const studios = [
    { id: 'Todos', name: 'Todos' },
    { id: 1, name: 'Estudio Itaquera' },
    { id: 2, name: 'Estudio São Miguel' }
];

const StudioSelector = ({ studios, selectedStudio, onSelectStudio }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center text-gray-700 font-semibold">
                <Building size={20} className="mr-2" />
                <span className="mr-3">Estúdio:</span>
            </div>
            {studios.map((studio) => (
                <button
                    key={studio.id}
                    onClick={() => onSelectStudio(studio.id)}
                    className={`
                        py-2 px-5 rounded-full font-medium text-sm transition-all
                        ${selectedStudio === studio.id
                            ? 'bg-[#67AF97] text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    {studio.name}
                </button>
            ))}
        </div>
    );
};

const MonthYearSelector = ({
    month,
    year,
    onMonthChange,
    onYearChange
}) => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
            <div className="relative inline-block w-36 sm:w-40">
                <select
                    value={month}
                    onChange={onMonthChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]"
                >
                    {monthNames.map((name, index) => (
                        <option key={index} value={index}>{name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
            <div className="relative inline-block w-28 sm:w-32">
                <select
                    value={year}
                    onChange={onYearChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]"
                >
                    {Array.from({ length: 3 }, (_, i) => 2023 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
        </div>
    );
};

const ClassCard = ({ id, title, date, time, teacher, studio, onEdit }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <article className="bg-[#FEFEFE] border border-black rounded-lg shadow-sm p-4 text-center flex flex-col justify-between h-auto min-h-[200px] relative group">
            <button 
                onClick={() => onEdit(id, title, teacher)}
                className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                title="Alterar Instrutor"
            >
                <Pencil size={16} />
            </button>

            <div>
                <h3 className="font-medium text-gray-900 leading-tight text-xl sm:text-2xl mb-2 line-clamp-2 pr-6">
                    {title}
                </h3>
                
                {/* ADICIONADO: DATA E HORÁRIO NO MESMO BLOCO */}
                <div className="font-medium text-lg sm:text-xl text-[#67AF97] mb-2">
                    <p>{formatDate(date)}</p>
                    <p>{time}</p> 
                </div>

                <p className="font-medium text-black text-base sm:text-lg line-clamp-1 mb-1">
                    {teacher}
                </p>
                <p className="font-medium text-black text-base sm:text-lg line-clamp-1">
                    {studio}
                </p>
            </div>
        </article>
    );
};

export default function AgendaEstudio() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();

    const [allClasses, setAllClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [selectedStudio, setSelectedStudio] = useState('Todos');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // --- ESTADOS PARA MODAIS E DADOS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);
    
    const [editingClass, setEditingClass] = useState({ id: null, title: '', teacherName: '' });
    const [selectedInstructorForEdit, setSelectedInstructorForEdit] = useState("");

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        titulo_aula: '',
        disciplina: '',
        data_aula: today,
        horario: '',
        duracao_minutos: '60',
        fk_id_estudio: '',
        fk_id_professor: '',
        desc_aula: '',
        estudantes_selecionados: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [instrResponse, studentsResponse] = await Promise.all([
                    api.get('/instrutores/'),
                    api.get('/alunos/')
                ]);
                setInstructors(instrResponse.data || []);
                setStudents(studentsResponse.data || []);
            } catch (error) {
                console.error("Erro ao buscar dados auxiliares:", error);
            }
        };
        fetchData();
    }, []);

    const instructorMap = useMemo(() => {
        const map = {};
        instructors.forEach(user => {
            if (user.professor && user.professor.id_professor) {
                map[user.professor.id_professor] = user.name_user;
            }
        });
        return map;
    }, [instructors]);

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);

            const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
            const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${lastDay}`;

            try {
                const response = await api.get('/agenda/cronograma', {
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    }
                });
                setAllClasses(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar agenda:", error);
                setAllClasses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, [currentMonth, currentYear, refreshKey]);

    const handleMonthChange = (e) => setCurrentMonth(parseInt(e.target.value));
    const handleYearChange = (e) => setCurrentYear(parseInt(e.target.value));
    const handleStudioChange = (studioId) => setSelectedStudio(studioId);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentToggle = (studentId) => {
        setFormData(prev => {
            const isSelected = prev.estudantes_selecionados.includes(studentId);
            if (isSelected) {
                return { ...prev, estudantes_selecionados: prev.estudantes_selecionados.filter(id => id !== studentId) };
            } else {
                return { ...prev, estudantes_selecionados: [...prev.estudantes_selecionados, studentId] };
            }
        });
    };

    const getDayOfWeekName = (dateString) => {
        const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const parts = dateString.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]); 
        return days[date.getDay()];
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            if (!formData.fk_id_professor || !formData.titulo_aula) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            const diaSemana = getDayOfWeekName(formData.data_aula);
            
            const parts = formData.data_aula.split('-');
            const startDateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            const endDateObj = new Date(startDateObj);
            endDateObj.setDate(endDateObj.getDate() + 1);
            
            const endYear = endDateObj.getFullYear();
            const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
            const endDay = String(endDateObj.getDate()).padStart(2, '0');
            const dataFimCalculada = `${endYear}-${endMonth}-${endDay}`;

            const payload = {
                fk_id_professor: parseInt(formData.fk_id_professor, 10),
                fk_id_estudio: parseInt(formData.fk_id_estudio, 10),
                titulo_aula: formData.titulo_aula,
                desc_aula: formData.desc_aula || `Aula de ${formData.titulo_aula}`,
                duracao_minutos: parseInt(formData.duracao_minutos, 10),
                disciplina: formData.disciplina || formData.titulo_aula,
                dia_da_semana: diaSemana,
                horario_inicio: formData.horario.substring(0, 5),
                data_inicio_periodo: formData.data_aula, 
                data_fim_periodo: dataFimCalculada,
                estudantes_a_matricular: formData.estudantes_selecionados.map(id => parseInt(id, 10))
            };

            await api.post('/aulas/create/recorrente', payload);

            alert('Aula criada com sucesso!');
            setIsModalOpen(false);
            setRefreshKey(prev => prev + 1);
            setFormData({
                titulo_aula: '', disciplina: '', data_aula: today, horario: '',
                duracao_minutos: '60', fk_id_estudio: '', fk_id_professor: '',
                desc_aula: '', estudantes_selecionados: []
            });
        } catch (error) {
            console.error("Erro ao criar aula:", error);
            const msg = error.response?.data?.detail || "Erro desconhecido ao criar aula.";
            alert(`Erro: ${msg}`);
        }
    };

    const openEditModal = (id, title, currentTeacherName) => {
        setEditingClass({ id, title, teacherName: currentTeacherName });
        setSelectedInstructorForEdit(""); 
        setIsEditModalOpen(true);
    };

    const handleUpdateInstructor = async (e) => {
        e.preventDefault();
        if (!selectedInstructorForEdit) {
            alert("Selecione um instrutor.");
            return;
        }

        try {
            const payload = {
                fk_id_professor: parseInt(selectedInstructorForEdit, 10)
            };

            await api.patch(`/aulas/${editingClass.id}`, payload);

            alert("Instrutor atualizado com sucesso!");
            setIsEditModalOpen(false);
            setRefreshKey(prev => prev + 1); 
        } catch (error) {
            console.error("Erro ao atualizar instrutor:", error);
            const msg = error.response?.data?.detail || "Erro ao atualizar.";
            alert(`Erro: ${msg}`);
        }
    };

    const filteredAndMappedClasses = allClasses
        .filter(aula => {
            if (selectedStudio === 'Todos') return true;
            return aula.EstudioID == selectedStudio;
        })
        .map(aula => {
            const profId = aula.professorResponsavel;
            const profName = instructorMap[profId] || (profId ? `Instrutor ID: ${profId}` : "Sem Instrutor");

            // Extrai o horário da data se disponível (formato ISO) ou usa um campo de horário se existir
            let time = "00:00";
            if (aula.dataAgendaAula && aula.dataAgendaAula.includes('T')) {
                time = aula.dataAgendaAula.split('T')[1].substring(0, 5);
            } else if (aula.horario_inicio) {
                time = aula.horario_inicio;
            }

            return {
                id: aula.AulaID || aula._id,
                title: aula.disciplina || aula.titulo_aula,
                date: aula.dataAgendaAula,
                time: time, // Adicionado aqui
                teacher: profName,
                studio: STUDIO_MAP[aula.EstudioID] || "Estúdio Desconhecido"
            };
        });

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <SidebarUnificada
                menuItems={sidebarConfigs.administrador.menuItems}
                userInfo={sidebarConfigs.administrador.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            <div
                className="flex flex-col flex-1 transition-all duration-300 min-w-0"
                style={{
                    marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
                    width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
                }}
            >
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto relative">

                        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center relative">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl text-center">
                                Agenda de Aulas
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 sm:mt-0 sm:absolute sm:right-0 bg-[#67AF97] hover:bg-[#559e85] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus size={20} />
                                <span className="font-medium">Nova Aula</span>
                            </button>
                        </div>

                        <StudioSelector 
                            studios={studios}
                            selectedStudio={selectedStudio}
                            onSelectStudio={handleStudioChange}
                        />

                        <div className="mb-8">
                            <MonthYearSelector 
                                month={currentMonth} 
                                year={currentYear} 
                                onMonthChange={handleMonthChange}
                                onYearChange={handleYearChange}
                            />
                        </div>

                        <div>
                            {isLoading ? (
                                <p className="col-span-full text-center text-gray-500 text-lg">Carregando aulas...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {filteredAndMappedClasses.length > 0 ? (
                                        filteredAndMappedClasses.map((c) => (
                                            <ClassCard
                                                key={c.id}
                                                id={c.id}
                                                title={c.title}
                                                date={c.date}
                                                time={c.time} // Passando o horário
                                                teacher={c.teacher}
                                                studio={c.studio}
                                                onEdit={openEditModal}
                                            />
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-gray-500 text-lg">
                                            Nenhuma aula encontrada para esta seleção.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL DE CRIAÇÃO --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center bg-[#67AF97] p-4 text-white">
                            <h3 className="text-xl font-semibold">Criar Nova Aula</h3>
                            <button onClick={() => setIsModalOpen(false)} className="hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateClass} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título da Aula *</label>
                                    <input 
                                        type="text" name="titulo_aula" required
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.titulo_aula} onChange={handleInputChange} placeholder="Ex: Yoga Iniciante"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                                    <input 
                                        type="text" name="disciplina"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.disciplina} onChange={handleInputChange} placeholder="Ex: Yoga"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                                    <input 
                                        type="date" name="data_aula" required min={today}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.data_aula} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                                    <input 
                                        type="time" name="horario" required
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.horario} onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos) *</label>
                                    <input 
                                        type="number" name="duracao_minutos" min="5" required
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.duracao_minutos} onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estúdio *</label>
                                    <select 
                                        name="fk_id_estudio" required
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.fk_id_estudio} onChange={handleInputChange}
                                    >
                                        <option value="">Selecione...</option>
                                        {studios.filter(s => s.id !== 'Todos').map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instrutor *</label>
                                    <select 
                                        name="fk_id_professor" required
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.fk_id_professor} onChange={handleInputChange}
                                    >
                                        <option value="">Selecione...</option>
                                        {instructors.map(instr => {
                                            if (!instr.professor?.id_professor) return null;
                                            return (
                                                <option key={instr.id_user} value={instr.professor.id_professor}>
                                                    {instr.name_user}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alunos (Opcional)</label>
                                    <div className="w-full border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
                                        {students.length === 0 ? (
                                            <span className="text-sm text-gray-500">Nenhum aluno encontrado.</span>
                                        ) : (
                                            students.map(student => {
                                                const studentId = student.estudante?.id_estudante;
                                                if (!studentId) return null;
                                                return (
                                                    <div key={student.id_user} className="flex items-center mb-2">
                                                        <input 
                                                            type="checkbox" id={`student-${studentId}`} value={studentId}
                                                            checked={formData.estudantes_selecionados.includes(studentId)}
                                                            onChange={() => handleStudentToggle(studentId)}
                                                            className="mr-2 h-4 w-4 text-[#67AF97]"
                                                        />
                                                        <label htmlFor={`student-${studentId}`} className="text-sm text-gray-700">
                                                            {student.name_user}
                                                        </label>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea 
                                        name="desc_aula" rows={3}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97]"
                                        value={formData.desc_aula} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-3 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-[#67AF97] text-white rounded-md hover:bg-[#559e85]">Criar Aula</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE EDIÇÃO (ATRIBUIR INSTRUTOR) --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center bg-[#67AF97] p-4 text-white">
                            <h3 className="text-lg font-semibold">Definir Instrutor</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="hover:text-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Aula:</p>
                                <p className="font-medium text-gray-900">{editingClass.title}</p>
                            </div>
                            <div className="mb-6">
                                <p className="text-sm text-gray-500">Instrutor Atual:</p>
                                <p className="font-medium text-gray-900">{editingClass.teacherName}</p>
                            </div>

                            <form onSubmit={handleUpdateInstructor}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Novo Instrutor</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#67AF97] focus:border-[#67AF97] mb-6"
                                    value={selectedInstructorForEdit}
                                    onChange={(e) => setSelectedInstructorForEdit(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {instructors.map(instr => {
                                        if (!instr.professor?.id_professor) return null;
                                        return (
                                            <option key={instr.id_user} value={instr.professor.id_professor}>
                                                {instr.name_user}
                                            </option>
                                        );
                                    })}
                                </select>

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="mr-3 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-[#67AF97] text-white rounded-md hover:bg-[#559e85]">Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}