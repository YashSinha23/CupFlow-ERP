import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getMaterials } from "./api";
import MaterialTable from "./components/MaterialTable";
import CreateMaterialForm from "./components/CreateMaterialForm";
import MaterialDetailsCard from "./components/MaterialDetailsCard";
import Modal from "../../components/Modal";
import styles from "./Page.module.css";

export default function Page() {
    const {
        data: materials,
        loading,
        error,
        refetch
    } = useFetch(() => getMaterials(), []);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const[ searchTerm, setSearchTerm] = useState("");

    function handleCreateSuccess() {
        setShowCreateForm(false);
        refetch();
    }

    if (loading) {
        return <p>Loading materials...</p>;
    }

    if (error) {
        return <p>Error loading materials: {error.message}</p>;
    }

    const filteredMaterial = materials.filter((material) =>
        material.materialType.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.content}>
                <div className={styles.pageHeader}>
                    <h1>Materials</h1>
                </div>

                <div className={styles.toolbar}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value)}}
                    />
                    <button
                        className={styles.createButton}
                        onClick={() => setShowCreateForm(true)}
                    >
                        + Create Material
                    </button>
                </div>

                {showCreateForm && (
                    <Modal onClose={() => setShowCreateForm(false)}>
                        <CreateMaterialForm
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </Modal>
                )}

                <MaterialTable materials={filteredMaterial} onRowClick={setSelectedMaterial} />
            </div>

            {selectedMaterial && (
                <MaterialDetailsCard
                    material={selectedMaterial}
                    onClose={() => setSelectedMaterial(null)}
                    onUpdated={refetch}
                />
            )}
        </div>
    );
}