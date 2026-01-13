import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { ADD_SCREEN } from '../../../graphql/mutations';
import { FETCH_THEATRE } from '../../../graphql/queries';
import { useScreenBuilderStore } from './screenBuilderStore';
import CategoryBlock from './CategoryBlock';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './AddScreen.css';

function AddScreen() {
    const navigate = useNavigate();
    const {
        screenName, theatreId, categories,
        setName, setTheatreId, addCategory, removeCategory, updateCategorySeats, reset
    } = useScreenBuilderStore();

    const [addScreen, { loading: creating }] = useMutation(ADD_SCREEN);
    const [fetchTheatre, { data: theatreData, loading: checkingTheatre }] = useLazyQuery(FETCH_THEATRE);

    const [newCatName, setNewCatName] = useState('Standard');
    const [newCatRows, setNewCatRows] = useState(10);
    const [newCatCols, setNewCatCols] = useState(15);

    const handleTheatreCheck = () => {
        if (theatreId) fetchTheatre({ variables: { id: theatreId } });
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        addCategory({
            id: uuidv4(),
            catId: categories.length + 1, // Sequential ID
            name: newCatName,
            rows: newCatRows,
            columns: newCatCols,
        });
    };

    const handleSaveScreen = async () => {
        // 1. Validation
        if (!screenName || !theatreId || categories.length === 0) {
            alert("Please fill all details and add at least one category/block.");
            return;
        }
        if (!theatreData?.fetchTheatre) {
            alert("Please verify a valid Theatre ID first.");
            return;
        }

        try {
            // 2. Transform State to GraphQL Input
            const formattedCategories = categories.map(cat => ({
                catId: cat.catId, // Use 1, 2, 3...
                name: cat.name,
                rows: cat.rows,
                columns: cat.columns,
                seats: cat.seats.map(s => ({
                    type: s.type,
                    seatId: s.seatId
                }))
            }));

            // Collect all SeatIDs just for the record (though backend likely re-calculates or flattened list is needed)
            // Based on schema, screen has `seatIDs: [String!]!`
            const allSeatIds = categories.flatMap(cat =>
                cat.seats.filter(s => s.type !== 0).map(s => s.seatId)
            );

            const variables = {
                screen: {
                    name: screenName,
                    theatreId: theatreId,
                    categories: formattedCategories,
                    seatIDs: allSeatIds
                }
            };

            const { data } = await addScreen({ variables });

            if (data?.addScreen) {
                alert("Screen added successfully!");
                reset(); // Clear store
                navigate('/theatre-admin/screens'); // We'll build list next
            }

        } catch (err: any) {
            console.error("Error creating screen:", err);
            alert("Failed to create screen: " + err.message);
        }
    };

    return (
        <div className="add-screen-page">
            <div className="page-header">
                <h2>Visual Screen Builder</h2>
                <div className="header-actions">
                    <button onClick={() => navigate('/theatre-admin')} className="btn-secondary">Cancel</button>
                    <button onClick={handleSaveScreen} className="btn-primary" disabled={creating}>
                        {creating ? "Saving..." : "💾 Save Screen"}
                    </button>
                </div>
            </div>

            <div className="builder-container">
                {/* Left Panel: Configuration */}
                <aside className="builder-sidebar">
                    <div className="config-section">
                        <h3>1. Basic Details</h3>
                        <div className="form-group">
                            <label>Theatre ID</label>
                            <div className="input-with-btn">
                                <input
                                    type="text"
                                    value={theatreId}
                                    onChange={(e) => setTheatreId(e.target.value)}
                                    placeholder="e.g., PVRAH"
                                />
                                <button onClick={handleTheatreCheck} className="btn-small">Check</button>
                            </div>
                            {theatreData?.fetchTheatre && <span className="success-text">✅ {theatreData.fetchTheatre.name}</span>}
                        </div>
                        <div className="form-group">
                            <label>Screen Name</label>
                            <input
                                type="text"
                                value={screenName}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Screen 1"
                            />
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>2. Add Block</h3>
                        <form onSubmit={handleAddCategory}>
                            <div className="form-group">
                                <label>Block Name</label>
                                <input
                                    type="text"
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Rows</label>
                                    <input
                                        type="number" min="1" max="25"
                                        value={newCatRows}
                                        onChange={e => setNewCatRows(Number(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cols</label>
                                    <input
                                        type="number" min="1" max="30"
                                        value={newCatCols}
                                        onChange={e => setNewCatCols(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-add-block">+ Add Block</button>
                        </form>
                    </div>
                </aside>

                {/* Right Panel: The Canvas */}
                <main className="builder-canvas">
                    {categories.length === 0 ? (
                        <div className="empty-canvas">
                            <div className="icon">🎨</div>
                            <h3>Your canvas is empty</h3>
                            <p>Add a block from the left sidebar to start building your layout.</p>
                        </div>
                    ) : (
                        <div className="blocks-list">
                            {categories.map(cat => (
                                <CategoryBlock
                                    key={cat.id}
                                    blockId={cat.id}
                                    name={cat.name}
                                    rows={cat.rows}
                                    columns={cat.columns}
                                    seats={cat.seats}
                                    onUpdateSeats={(seats) => updateCategorySeats(cat.id, seats)}
                                    onRemove={() => removeCategory(cat.id)}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AddScreen;
