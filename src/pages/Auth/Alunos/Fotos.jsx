import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const mockFotos = [
    { id: 1, ano: 2023, descricao: "Chegada", url: "https://via.placeholder.com/150" },
    { id: 2, ano: 2024, descricao: "Agora", url: "https://via.placeholder.com/150" },
    { id: 3, ano: 2024, descricao: "Progresso", url: "https://via.placeholder.com/150" },
];

export default function FotosPage() {
    const [fotos, setFotos] = useState([]);
    const [anoFiltro, setAnoFiltro] = useState("");
    const [isInstrutor, setIsInstrutor] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [novaFoto, setNovaFoto] = useState(null);
    const [descricao, setDescricao] = useState("");

    const setMockUserType = () => true;

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario")) || { id: 1, tipo: "aluno" };
        usuario.tipo = setMockUserType() ? "instrutor" : "aluno";
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setIsInstrutor(usuario.tipo === "instrutor");

        fetchFotos();
    }, []);

    const fetchFotos = async (ano = "") => {
        console.log("Chamando API para buscar fotos do ano:", ano);
        // FUTURO: trocar por chamada real, ex:
        // const res = await fetch(`/api/fotos?ano=${ano}`);
        // const data = await res.json();
        const dadosFiltrados = ano ? mockFotos.filter(f => f.ano.toString() === ano) : mockFotos;
        setFotos(dadosFiltrados);
    };

    const handleFiltroAno = (e) => {
        const ano = e.target.value;
        setAnoFiltro(ano);
        fetchFotos(ano);
    };

    const handleUploadFoto = () => {
        if (!novaFoto || !descricao) {
            alert("Escolha uma foto e adicione uma descrição.");
            return;
        }
        console.log("Enviar foto:", novaFoto, descricao);
        // FUTURO: enviar para API
        const nova = {
            id: fotos.length + 1,
            ano: new Date().getFullYear(),
            descricao,
            url: URL.createObjectURL(novaFoto),
        };
        setFotos(prev => [...prev, nova]);
        setOpenModal(false);
        setNovaFoto(null);
        setDescricao("");
    };

    const anosDisponiveis = [...new Set(mockFotos.map(f => f.ano))];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Fotos do Aluno</h1>

            <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
                <div className="flex gap-2 items-center">
                    <label>Filtrar por ano:</label>
                    <select value={anoFiltro} onChange={handleFiltroAno} className="border rounded px-2 py-1">
                        <option value="">Todos</option>
                        {anosDisponiveis.map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </select>
                </div>
                {isInstrutor && (
                    <button
                        className="flex items-center gap-1 px-4 py-2 bg-teal-500 text-white rounded"
                        onClick={() => setOpenModal(true)}
                    >
                        <Plus size={18} /> Adicionar Foto
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {fotos.map(foto => (
                    <div key={foto.id} className="bg-white p-4 rounded shadow">
                        <img src={foto.url} alt={foto.descricao} className="w-full h-48 object-cover rounded" />
                        <h3 className="mt-2 font-medium text-gray-700">{foto.descricao}</h3>
                        <span className="text-sm text-gray-500">{foto.ano}</span>
                    </div>
                ))}
            </div>

            {openModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                        <button className="absolute top-2 right-2" onClick={() => setOpenModal(false)}>
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Adicionar Foto</h2>
                        <div className="flex flex-col gap-4">
                            <input type="file" accept="image/*" onChange={(e) => setNovaFoto(e.target.files[0])} />
                            <input
                                type="text"
                                placeholder="Descrição"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                            <button
                                className="px-4 py-2 bg-teal-500 text-white rounded"
                                onClick={handleUploadFoto}
                            >
                                Enviar Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
