import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { CheckCircle, XCircle, FileText, MoreVertical } from 'lucide-react';

const Checkbox = ({ checked, onChange }) => (
    <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
    />
);

export default function HistoricoAulasPage() {
    const [aulas, setAulas] = useState([]);
    const [selectedAulas, setSelectedAulas] = useState([]);
    const [isInstrutor, setIsInstrutor] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const setMockUserType = () => true;

    const fetchAulas = async (inicio, fim) => {
        console.log("Chamando API com intervalo:", inicio, fim);
        // FUTURO: trocar por chamada real, ex:
        // const res = await fetch(`/api/aulas?start=${inicio}&end=${fim}`);
        // const data = await res.json();

        const mockData = [
            { id: 1, aula: "Aula 1", profissional: "Ana Souza", data: "2025-09-02", observacoes: "Apresentou dificuldade inicial...", status: "Presente", statusColor: "bg-green-500 hover:bg-green-600" },
            { id: 2, aula: "Aula 2", profissional: "Ana Souza", data: "2025-09-03", observacoes: "Apresentou dificuldade inicial...", status: "Presente", statusColor: "bg-green-500 hover:bg-green-600" },
            { id: 3, aula: "Aula 3", profissional: "Ana Souza", data: "2025-09-03", observacoes: "Demonstrou interesse...", status: "Presente", statusColor: "bg-green-500 hover:bg-green-600" },
            { id: 4, aula: "Aula 4", profissional: "João Lima", data: "2025-09-04", observacoes: "Não compareceu...", status: "Falta", statusColor: "bg-red-500 hover:bg-red-600" },
            { id: 5, aula: "Aula 5", profissional: "Maria Santos", data: "2025-09-05", observacoes: "Performance excelente...", status: "Presente", statusColor: "bg-green-500 hover:bg-green-600" },
        ];

        if (inicio && fim) {
            const inicioDate = new Date(inicio);
            const fimDate = new Date(fim);
            return mockData.filter(aula => {
                const aulaDate = new Date(aula.data);
                return aulaDate >= inicioDate && aulaDate <= fimDate;
            });
        }
        return mockData;
    };

    // Simulação de atualização de status no backend
    const updateStatusAula = async (id, status) => {
        console.log(`Chamando API para alterar status da aula ${id} para ${status}`);
        // FUTURO: trocar por chamada real, ex:
        // await fetch(`/api/aulas/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });

        const colorMap = {
            "Presente": "bg-green-500 hover:bg-green-600",
            "Falta": "bg-red-500 hover:bg-red-600",
            "Atestado": "bg-cyan-500 hover:bg-cyan-600"
        };

        setAulas(prev => prev.map(aula => aula.id === id ? { ...aula, status, statusColor: colorMap[status] } : aula));
    };

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario")) || { id: 1, tipo: "aluno" };
        usuario.tipo = setMockUserType() ? "instrutor" : "aluno";
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setIsInstrutor(usuario.tipo === "instrutor");

        fetchAulas(startDate, endDate).then(data => setAulas(data));
    }, [startDate, endDate]);

    const totalPresencas = aulas.filter(a => a.status === 'Presente').length;
    const totalFaltas = aulas.filter(a => a.status === 'Falta').length;

    const handleSelectAll = (e) => setSelectedAulas(e.target.checked ? aulas.map(a => a.id) : []);
    const handleSelectAula = (id) => setSelectedAulas(prev => prev.includes(id) ? prev.filter(aulaId => aulaId !== id) : [...prev, id]);

    const alterarStatus = (id, status) => {
        updateStatusAula(id, status);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Histórico de Aulas</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-green-100 text-green-800">
                    <h2 className="text-xl font-medium mb-1">Total de Presenças</h2>
                    <p className="text-5xl font-bold">{totalPresencas}</p>
                </div>
                <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-red-100 text-red-800">
                    <h2 className="text-xl font-medium mb-1">Total de Faltas</h2>
                    <p className="text-5xl font-bold">{totalFaltas < 10 ? `0${totalFaltas}` : totalFaltas}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
                <div className="flex gap-2 items-center">
                    <label>Filtrar de:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
                </div>
                <div className="flex gap-2 items-center">
                    <label>até:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3">
                                <Checkbox checked={selectedAulas.length === aulas.length && aulas.length > 0} onChange={handleSelectAll} />
                            </th>
                            <th className="px-3 py-3">Aula</th>
                            <th className="px-3 py-3">Profissional</th>
                            <th className="px-3 py-3">Data</th>
                            <th className="px-3 py-3">Observações</th>
                            <th className="px-3 py-3">Status</th>
                            {isInstrutor && <th className="px-3 py-3"></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {aulas.map(aula => (
                            <tr key={aula.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-3 py-4"><Checkbox checked={selectedAulas.includes(aula.id)} onChange={() => handleSelectAula(aula.id)} /></td>
                                <td className="px-3 py-4">{aula.aula}</td>
                                <td className="px-3 py-4">{aula.profissional}</td>
                                <td className="px-3 py-4">{aula.data}</td>
                                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">{aula.observacoes}</td>
                                <td className="px-3 py-4">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${aula.statusColor}`}>
                                        {aula.status}
                                    </span>
                                </td>
                                {isInstrutor && (
                                    <td className="px-3 py-4 text-right text-sm font-medium relative">
                                        <MoreVertical 
                                            className="cursor-pointer" 
                                            onClick={() => setOpenDropdownId(openDropdownId === aula.id ? null : aula.id)} 
                                        />
                                        {openDropdownId === aula.id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50 flex flex-col">
                                                <button className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => alterarStatus(aula.id, "Presente")}>
                                                    <CheckCircle className="mr-2 text-green-500" />Presença
                                                </button>
                                                <button className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => alterarStatus(aula.id, "Falta")}>
                                                    <XCircle className="mr-2 text-red-500" />Falta
                                                </button>
                                                <button className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => alterarStatus(aula.id, "Atestado")}>
                                                    <FileText className="mr-2 text-cyan-500" />Atestado
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
