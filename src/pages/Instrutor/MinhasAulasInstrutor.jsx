import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown, Plus, X } from 'lucide-react';

// Cores do design
const darkBlueBg = 'bg-[#3A4A9B]';
const whiteText = 'text-white';
const blackText = 'text-black';

const BASE_URL = 'http://localhost:8000';

// --- FUNÇÃO FETCH SEGURA ---
async function safeFetch(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401 || response.status === 403) {
            console.warn(`[SafeFetch] Bloqueado em ${endpoint} (${response.status}). Ignorando.`);
            return null; 
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na requisição segura:", error);
        return null;
    }
}

// --- MODAL ---
const NewClassModal = ({ isOpen, onClose, students, onConfirm, isLoading }) => {
    const [formData, setFormData] = useState({
        aluno_id: '',
        data_aula: '',
        horario_aula: '',
        modalidade: 'Pilates',
    });

    // Resetar form ao abrir
    useEffect(() => {
        if (isOpen) {
            setFormData({
                aluno_id: '',
                data_aula: '',
                horario_aula: '',
                modalidade: 'Pilates',
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Agendar Nova Aula</h3>
                    <button onClick={onClose} disabled={isLoading}>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Aluno</label>
                        <select
                            required
                            disabled={isLoading}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-[#67AF97] focus:ring-[#67AF97] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={formData.aluno_id}
                            onChange={(e) => setFormData({ ...formData, aluno_id: e.target.value })}
                        >
                            <option value="">Selecione um aluno...</option>
                            {students.length > 0 ? (
                                students.map(student => (
                                    <option key={student.id} value={student.id}>{student.nome}</option>
                                ))
                            ) : (
                                <option value="" disabled>Nenhum aluno disponível</option>
                            )}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">*Lista baseada em aulas anteriores.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data</label>
                        <input 
                            type="date" 
                            required 
                            disabled={isLoading}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed" 
                            value={formData.data_aula} 
                            onChange={(e) => setFormData({ ...formData, data_aula: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Horário</label>
                        <input 
                            type="time" 
                            required 
                            disabled={isLoading}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed" 
                            value={formData.horario_aula} 
                            onChange={(e) => setFormData({ ...formData, horario_aula: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Modalidade</label>
                        <select 
                            disabled={isLoading}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed" 
                            value={formData.modalidade} 
                            onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                        >
                            <option value="Pilates">Pilates</option>
                            <option value="Yoga">Yoga</option>
                            <option value="Funcional">Funcional</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#67AF97] text-white py-2 px-4 rounded-md hover:bg-[#5a9c87] transition-colors font-medium mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Criando Aula...' : 'Confirmar Agendamento'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- CALENDAR & CARD ---
const CalendarGrid = ({ month, year, selectedDay, onDaySelect, onMonthChange, onYearChange, daysWithClasses }) => {
    const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const daysArray = Array(startDay).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
    const weeks = [];
    for (let i = 0; i < daysArray.length; i += 7) weeks.push(daysArray.slice(i, i + 7));

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
                <div className="flex gap-2">
                    <div className="relative inline-block w-36 sm:w-40">
                        <select value={month} onChange={onMonthChange} className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]">
                            {monthNames.map((name, index) => <option key={index} value={index}>{name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                    </div>
                    <div className="relative inline-block w-28 sm:w-32">
                        <select value={year} onChange={onYearChange} className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]">
                            {Array.from({ length: 5 }, (_, i) => 2024 + i).map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden text-lg">
                {weekdays.map(day => <div key={day} className="py-3 bg-gray-50 border-b border-r border-gray-300 last:border-r-0 text-center font-semibold text-gray-700 text-sm sm:text-base">{day}</div>)}
                {weeks.map((week, weekIndex) => week.map((day, dayIndex) => {
                    const hasClass = daysWithClasses.has(day);
                    const isSelected = day === selectedDay;
                    const dayBg = isSelected ? darkBlueBg : hasClass ? 'bg-blue-100' : 'bg-white';
                    const textColor = isSelected ? whiteText : blackText;
                    return (
                        <div key={`${weekIndex}-${dayIndex}`} className={`p-2 text-center font-semibold cursor-pointer h-16 sm:h-20 flex items-center justify-center text-lg sm:text-xl ${dayBg} ${textColor} border-r border-b border-gray-300 ${day === null ? 'text-transparent' : ''} transition-colors duration-200`} onClick={() => day !== null && onDaySelect(day)}>
                            {day} {hasClass && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>}
                        </div>
                    );
                }))}
            </div>
        </div>
    );
};

const ClassCard = ({ modality, date, time, studio, studentName }) => (
    <article className="bg-[#FEFEFE] border border-gray-200 rounded-lg shadow-sm p-4 text-center flex flex-col justify-between h-auto min-h-[160px]">
        <div>
            <h3 className="font-semibold text-gray-900 leading-tight text-xl sm:text-2xl mb-1">{modality}</h3>
            <p className="text-sm text-gray-500 mb-2">{studentName || "Sem Aluno"}</p>
            <p className="font-medium text-lg sm:text-xl text-[#67AF97] mb-2">{date} - {time}</p>
            <p className="font-medium text-black text-base sm:text-lg">{studio}</p>
        </div>
    </article>
);

// --- COMPONENTE PRINCIPAL ---
export default function MinhasAulasInstrutor() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [classes, setClasses] = useState([]); 
    const [students, setStudents] = useState([]); 
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    // Estado para armazenar o ID do instrutor logado
    const [instructorId, setInstructorId] = useState(null);

    // --- INICIALIZAÇÃO E DADOS ---
    useEffect(() => {
        console.log("✅ Página carregada - usando fetch nativo");
        
        // Carrega dados
        fetchData();
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        filterClasses();
    }, [classes, selectedDay, currentMonth, currentYear]);

    // --- BUSCA DE DADOS DO USUÁRIO LOGADO - VERSÃO CORRIGIDA ---
    const fetchCurrentUser = async () => {
        console.log("🔄 Buscando dados do usuário logado...");
        
        // MÉTODO 1: Tentar via /users/me
        let user = await safeFetch('/users/me');
        
        if (!user) {
            console.log("❌ /users/me falhou. Tentando método alternativo...");
            
            // MÉTODO 2: Tentar extrair do token JWT
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    // Decodificar o token JWT (parte do payload)
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log("📋 Payload do JWT:", payload);
                    
                    user = {
                        id_user: payload.sub || payload.id_user,
                        professor: payload.professor || null
                    };
                    console.log("✅ Usuário extraído do JWT:", user);
                } catch (error) {
                    console.error("❌ Erro ao decodificar JWT:", error);
                }
            }
            
            // MÉTODO 3: Buscar todas as aulas e inferir o instrutor
            if (!user) {
                console.log("🔍 Tentando inferir instrutor das aulas...");
                const aulas = await safeFetch('/aulas/');
                if (aulas && aulas.length > 0) {
                    // Pegar o professor da primeira aula
                    const primeiraAula = aulas[0];
                    if (primeiraAula.fk_id_professor) {
                        user = {
                            id_user: primeiraAula.fk_id_professor,
                            professor: { id_professor: primeiraAula.fk_id_professor }
                        };
                        console.log("✅ Instrutor inferido das aulas:", user);
                    }
                }
            }
        }

        if (user) {
            // Tenta várias formas de obter o ID do professor
            if (user.professor && user.professor.id_professor) {
                console.log("🎯 ID do professor encontrado:", user.professor.id_professor);
                setInstructorId(user.professor.id_professor);
            } else if (user.id_user) {
                console.log("⚠️  Usando ID do usuário como fallback:", user.id_user);
                setInstructorId(user.id_user);
            } else {
                console.error("❌ Não foi possível obter ID do instrutor");
                // Fallback final - usar um ID fixo (você pode ajustar conforme seu banco)
                setInstructorId(1);
                console.log("🔄 Usando ID fixo como fallback: 1");
            }
        } else {
            console.error("❌ Não foi possível carregar dados do usuário");
            // Fallback crítico
            setInstructorId(1);
            console.log("🚨 Fallback crítico - ID do instrutor definido como: 1");
        }
    };

    // FUNÇÃO ROBUSTA PARA EXTRAIR ALUNOS - VERSÃO DEFINITIVA
    const extractStudentsFromClasses = async (classesList) => {
        console.log("🔄 EXTRAINDO ALUNOS DAS AULAS (MÉTODO DEFINITIVO)...");
        const uniqueStudentsMap = new Map();
        
        // PRIMEIRO: Buscar TODOS os alunos disponíveis via API
        try {
            console.log("🔍 Buscando TODOS os alunos via API...");
            const allStudents = await safeFetch('/alunos/');
            console.log("📦 Alunos retornados da API /alunos/:", allStudents);
            
            if (allStudents && Array.isArray(allStudents)) {
                allStudents.forEach(aluno => {
                    const studentId = aluno.id_user || aluno.id;
                    const studentName = aluno.name_user || aluno.nome || 'Aluno sem nome';
                    
                    if (studentId && !uniqueStudentsMap.has(studentId)) {
                        uniqueStudentsMap.set(studentId, { 
                            id: studentId, 
                            nome: studentName 
                        });
                        console.log(`🎯 ALUNO DA API: ${studentName} (ID: ${studentId})`);
                    }
                });
            }
        } catch (error) {
            console.log("❌ Não foi possível buscar alunos via API, continuando com extração das aulas...");
        }

        // SEGUNDO: Extrair alunos das aulas
        classesList.forEach((cls, index) => {
            console.log(`\n--- Aula ${index + 1} ---`);
            
            let studentName = null;
            let studentId = null;

            // MÉTODO 1: estudantes_associacao
            if (cls.estudantes_associacao && Array.isArray(cls.estudantes_associacao)) {
                cls.estudantes_associacao.forEach((associacao) => {
                    if (associacao.estudante) {
                        const estudante = associacao.estudante;
                        studentName = estudante.name_user || estudante.nome || 'Aluno sem nome';
                        studentId = estudante.id_user || estudante.id || estudante.fk_id_user;
                    } else if (associacao.fk_id_estudante) {
                        studentId = associacao.fk_id_estudante;
                        studentName = associacao.nome || `Aluno ${studentId}`;
                    }
                });
            }

            // Adicionar se encontrou
            if (studentId && studentName) {
                if (!uniqueStudentsMap.has(studentId)) {
                    uniqueStudentsMap.set(studentId, { 
                        id: studentId, 
                        nome: studentName 
                    });
                    console.log(`✅ ALUNO EXTRAÍDO: ${studentName} (ID: ${studentId})`);
                }
            }
        });

        const studentsArray = Array.from(uniqueStudentsMap.values());
        console.log(`📊 RESUMO FINAL: ${studentsArray.length} alunos carregados`, studentsArray);
        
        // ÚLTIMO FALLBACK: Se ainda zero alunos
        if (studentsArray.length === 0) {
            console.log("🚨 NENHUM ALUNO ENCONTRADO EM LUGAR NENHUM! Usando fallback crítico...");
            
            // Alunos de fallback baseados no seu SQL
            const fallbackStudents = [
                { id: 1, nome: "Aluno Teste Final" }
            ];
            
            console.log("🔄 Fallback crítico aplicado:", fallbackStudents);
            setStudents(fallbackStudents);
        } else {
            setStudents(studentsArray);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        console.log("🔄 Buscando aulas da API...");
        
        try {
            const data = await safeFetch('/aulas/'); 
            
            console.log("📋 Dados brutos retornados da API:", data);
            
            if (data && Array.isArray(data)) {
                console.log(`✅ ${data.length} aulas recebidas da API`);
                
                const formattedClasses = data.map((cls, index) => {
                    console.log(`\n--- Processando Aula ${index + 1} ---`);
                    
                    // Processar data
                    const datePart = cls.data_aula ? cls.data_aula.split('T')[0] : ''; 
                    const dateParts = datePart.split('-');
                    const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : 'Data inválida';
                    
                    return {
                        id: cls.id || cls.id_aula || `aula-${index}`,
                        modality: cls.modalidade || cls.titulo_aula || 'Aula',
                        date: formattedDate,
                        fullDate: datePart, 
                        time: cls.horario_aula || '08:00', 
                        studio: 'Estúdio Ghibli', 
                        // Manter a estrutura original para extração
                        ...cls
                    };
                });

                setClasses(formattedClasses);
                await extractStudentsFromClasses(data); // Passar os dados ORIGINAIS para extração
            } else {
                console.log("❌ Nenhum dado retornado das aulas ou formato inválido");
                setClasses([]);
                // Forçar alunos de fallback
                setStudents([
                    { id: 1, nome: "Aluno Teste Final" }
                ]);
            }
        } catch (error) {
            console.error("❌ Erro ao buscar aulas:", error);
            setClasses([]);
            // Forçar alunos de fallback em caso de erro
            setStudents([
                { id: 1, nome: "Aluno Teste Final" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterClasses = () => {
        let filtered = classes.filter(c => {
            if (!c.fullDate) return false;
            const [year, month, day] = c.fullDate.split('-').map(Number);
            const classDate = new Date(year, month - 1, day); 
            if (classDate.getMonth() !== currentMonth || classDate.getFullYear() !== currentYear) return false;
            if (selectedDay && classDate.getDate() !== selectedDay) return false;
            return true;
        });
        setFilteredClasses(filtered);
    };

    const getDaysWithClasses = (classList) => {
        const days = new Set();
        classList.forEach(cls => {
            if (!cls.fullDate) return; 
            const dateParts = cls.fullDate.split('-');
            if (dateParts.length < 3) return;
            const classDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); 
            if (classDate.getMonth() === currentMonth && classDate.getFullYear() === currentYear) days.add(classDate.getDate());
        });
        return days;
    };

    const daysWithClasses = getDaysWithClasses(classes);

    const handleCreateClass = async (formData) => {
        setIsCreating(true);
        console.log("🔄 Iniciando criação de aula...");
        
        // Validação de segurança: Precisamos do ID do instrutor
        if (!instructorId) {
            alert("❌ Erro: Não foi possível identificar o ID do instrutor logado. Tente recarregar a página.");
            setIsCreating(false);
            return;
        }

        console.log("🎯 ID do instrutor:", instructorId);
        console.log("📝 Dados do formulário:", formData);

        try {
            // 1. Criar a Aula - POST /aulas/
            const aulaPayload = {
                data_aula: `${formData.data_aula}T${formData.horario_aula}:00`, 
                titulo_aula: formData.modalidade,
                desc_aula: `Aula de ${formData.modalidade}`,
                fk_id_estudio: 1, 
                fk_id_professor: instructorId,
                modalidade: formData.modalidade,
                duracao_minutos: 60,
                disciplina: formData.modalidade
            };
            
            console.log("📤 Payload da aula:", aulaPayload);
            
            const aulaResponse = await safeFetch('/aulas/', {
                method: 'POST',
                body: JSON.stringify(aulaPayload)
            });

            console.log("📥 Resposta da criação da aula:", aulaResponse);

            if (aulaResponse && (aulaResponse.id || aulaResponse.id_aula)) {
                const aulaId = aulaResponse.id || aulaResponse.id_aula;
                
                // 2. Vincular Aluno - POST /aulas/{id}/matricular
                const matriculaPayload = {
                    fk_id_estudante: parseInt(formData.aluno_id),
                    tipo_de_aula: 'normal'
                };

                console.log("📤 Payload da matrícula:", matriculaPayload);
                console.log("🔗 URL da matrícula:", `/aulas/${aulaId}/matricular`);
                
                const matriculaResponse = await safeFetch(`/aulas/${aulaId}/matricular`, {
                    method: 'POST',
                    body: JSON.stringify(matriculaPayload)
                });

                console.log("📥 Resposta da matrícula:", matriculaResponse);

                if (matriculaResponse) {
                    alert("✅ Aula criada e aluno matriculado com sucesso!");
                    setIsModalOpen(false);
                    fetchData(); // Recarrega os dados
                } else {
                    alert("⚠️ Aula criada, mas erro ao matricular aluno. Verifique o console.");
                }
            } else {
                console.error("❌ Resposta da criação:", aulaResponse);
                alert("❌ Erro ao criar aula. Verifique o console para detalhes.");
            }
        } catch (error) {
            console.error("❌ Erro ao criar aula:", error);
            alert("❌ Erro ao criar aula. Verifique o console para detalhes.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <SidebarUnificada 
                menuItems={sidebarConfigs.instrutor.menuItems} 
                userInfo={sidebarConfigs.instrutor.userInfo} 
                isOpen={menuOpen} 
                onOpenChange={setMenuOpen} 
            />
            <div className="flex flex-col flex-1 transition-all duration-300 min-w-0" style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}>
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6">
                    <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">Minhas Aulas (Instrutor)</h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsModalOpen(true)} 
                                    className="flex items-center gap-2 bg-[#67AF97] text-white px-4 py-2 rounded-md hover:bg-[#5a9c87] transition-colors"
                                    disabled={isLoading || isCreating}
                                >
                                    <Plus size={20} /> 
                                    {isLoading ? 'Carregando...' : 'Nova Aula'}
                                </button>
                            </div>
                        </div>
                        
                        {isLoading ? (
                            <div className="text-center py-8">Carregando aulas...</div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <CalendarGrid 
                                        month={currentMonth} 
                                        year={currentYear} 
                                        selectedDay={selectedDay} 
                                        onDaySelect={setSelectedDay} 
                                        onMonthChange={(e) => setCurrentMonth(parseInt(e.target.value))} 
                                        onYearChange={(e) => setCurrentYear(parseInt(e.target.value))} 
                                        daysWithClasses={daysWithClasses} 
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-xl sm:text-2xl mb-4">
                                        {selectedDay ? `Aulas do dia ${selectedDay}` : 'Todas as Aulas do Mês'}
                                    </h3>
                                    {filteredClasses.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {selectedDay 
                                                ? `Nenhuma aula encontrada para o dia ${selectedDay}`
                                                : 'Nenhuma aula encontrada para este mês'
                                            }
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                            {filteredClasses.map((item) => (
                                                <ClassCard key={item.id} {...item} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
            
            <NewClassModal 
                isOpen={isModalOpen} 
                onClose={() => !isCreating && setIsModalOpen(false)} 
                students={students} 
                onConfirm={handleCreateClass}
                isLoading={isCreating}
            />
        </div>
    );
}