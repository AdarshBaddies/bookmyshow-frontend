import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { ADD_SHOW } from '../../../graphql/mutations';
import { GET_SCREENS } from '../../../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './AddShow.css';

interface ShowSlot {
    id: number;
    showTime: string;
    screenId: string;
    layoutId: string;
    lang: string;
}

function AddShow() {
    const navigate = useNavigate();
    const [addShow, { loading: creating }] = useMutation(ADD_SHOW);
    const [getScreens] = useLazyQuery(GET_SCREENS);

    const [globalInfo, setGlobalInfo] = useState({
        theatreId: '',
        movieId: '',
        date: '',
    });

    const [showSlots, setShowSlots] = useState<ShowSlot[]>([
        { id: Date.now(), showTime: '', screenId: '', layoutId: '', lang: 'Hindi' }
    ]);

    const [availableScreens, setAvailableScreens] = useState<any[]>([]);

    const [pricing, setPricing] = useState([
        { categoryName: '', price: 0 },
    ]);

    const handleTheatreBlur = async () => {
        if (!globalInfo.theatreId) return;
        try {
            const { data } = await getScreens({ variables: { theatreId: globalInfo.theatreId } });
            if (data?.getScreens) {
                setAvailableScreens(data.getScreens);
            }
        } catch (err) {
            console.error("Failed to fetch screens:", err);
        }
    };

    // Slot Handlers
    const handleAddSlot = () => {
        setShowSlots([...showSlots, { id: Date.now(), showTime: '', screenId: '', layoutId: '', lang: 'Hindi' }]);
    };

    const handleRemoveSlot = (id: number) => {
        if (showSlots.length === 1) return;
        setShowSlots(showSlots.filter(s => s.id !== id));
    };

    const handleSlotChange = (id: number, field: keyof ShowSlot, value: string) => {
        setShowSlots(showSlots.map(slot => {
            if (slot.id === id) {
                const updated = { ...slot, [field]: value };
                if (field === 'screenId') {
                    const screen = availableScreens.find(s => s.id === value);
                    updated.layoutId = screen?.layoutId || '';
                }
                return updated;
            }
            return slot;
        }));
    };

    // Pricing Handlers
    const handleAddPriceRow = () => {
        setPricing([...pricing, { categoryName: '', price: 0 }]);
    };

    const handleRemovePriceRow = (index: number) => {
        if (pricing.length === 1) return;
        setPricing(pricing.filter((_, i) => i !== index));
    };

    const handlePriceChange = (index: number, field: string, value: string | number) => {
        const newPricing = [...pricing];
        (newPricing[index] as any)[field] = field === 'price' ? Number(value) : value;
        setPricing(newPricing);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (showSlots.some(s => !s.showTime || !s.screenId)) {
            alert("Please fill all show slot details.");
            return;
        }

        const showDetails = showSlots.map(slot => {
            const exactShowTime = new Date(`${globalInfo.date}T${slot.showTime}:00`);
            const publishTime = new Date(exactShowTime);
            publishTime.setHours(publishTime.getHours() - 24); // Default 1 day before

            return {
                screenId: slot.screenId,
                status: 1, // Active
                publishTime: publishTime.toISOString(),
                showTime: exactShowTime.toISOString(),
                lang: slot.lang,
                layoutId: slot.layoutId,
                categoryDetails: pricing.map((p, idx) => ({
                    categoryId: idx + 1,
                    categoryName: p.categoryName,
                    price: parseFloat(p.price.toString()),
                    currency: "INR",
                    rowCount: 1, // Meta requirements
                    columnsCount: 20
                }))
            };
        });

        try {
            await addShow({
                variables: {
                    date: new Date(globalInfo.date).toISOString(),
                    movieID: globalInfo.movieId,
                    theatreId: globalInfo.theatreId,
                    shs: showDetails
                }
            });
            alert('Batch of shows added successfully!');
            navigate('/theatre-admin/shows');
        } catch (err: any) {
            console.error("Mutation Error:", err);
            alert('Error adding shows: ' + err.message);
        }
    };

    return (
        <div className="add-show-page">
            <div className="page-header">
                <h2>Add Shows (Batch)</h2>
                <button onClick={() => navigate('/theatre-admin/shows')} className="btn-back">
                    ← Back
                </button>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {/* 1. Global Context */}
                    <div className="form-section">
                        <h3>1. Show Context</h3>
                        <div className="form-group">
                            <label>Theatre ID *</label>
                            <input
                                type="text"
                                value={globalInfo.theatreId}
                                onChange={e => setGlobalInfo({ ...globalInfo, theatreId: e.target.value })}
                                onBlur={handleTheatreBlur}
                                placeholder="Theatre ID (e.g. PVRAH)"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Movie ID *</label>
                                <input
                                    type="text"
                                    value={globalInfo.movieId}
                                    onChange={e => setGlobalInfo({ ...globalInfo, movieId: e.target.value })}
                                    placeholder="Movie ID"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    value={globalInfo.date}
                                    onChange={e => setGlobalInfo({ ...globalInfo, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Show Slots */}
                    <div className="form-section">
                        <h3>
                            2. Show Timings & Screens
                            <button type="button" onClick={handleAddSlot} className="btn-add-slot">
                                + Add Slot
                            </button>
                        </h3>

                        <div className="slots-container">
                            {showSlots.map((slot, index) => (
                                <div key={slot.id} className="show-slot-card">
                                    <div className="form-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            value={slot.showTime}
                                            onChange={e => handleSlotChange(slot.id, 'showTime', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Screen</label>
                                        <select
                                            value={slot.screenId}
                                            onChange={e => handleSlotChange(slot.id, 'screenId', e.target.value)}
                                            disabled={availableScreens.length === 0}
                                            required
                                        >
                                            <option value="">Select Screen</option>
                                            {availableScreens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Language</label>
                                        <select
                                            value={slot.lang}
                                            onChange={e => handleSlotChange(slot.id, 'lang', e.target.value)}
                                            required
                                        >
                                            <option value="Hindi">Hindi</option>
                                            <option value="English">English</option>
                                            <option value="Tamil">Tamil</option>
                                            <option value="Telugu">Telugu</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-remove-slot"
                                        onClick={() => handleRemoveSlot(slot.id)}
                                        disabled={showSlots.length === 1}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Pricing - Applied to all slots */}
                    <div className="form-section">
                        <h3>
                            3. Pricing Categories
                            <button type="button" onClick={handleAddPriceRow} className="btn-add-row">
                                + Add Category
                            </button>
                        </h3>

                        <div className="pricing-grid-header">
                            <span>ID</span>
                            <span>Name</span>
                            <span>Price (INR)</span>
                            <span>Action</span>
                        </div>

                        {pricing.map((p, idx) => (
                            <div key={idx} className="price-row-dynamic">
                                <div className="cat-id-badge">#{idx + 1}</div>
                                <input
                                    type="text"
                                    value={p.categoryName}
                                    onChange={e => handlePriceChange(idx, 'categoryName', e.target.value)}
                                    placeholder="e.g. Premium"
                                    required
                                />
                                <input
                                    type="number"
                                    value={p.price}
                                    onChange={e => handlePriceChange(idx, 'price', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn-remove-row"
                                    onClick={() => handleRemovePriceRow(idx)}
                                    disabled={pricing.length === 1}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}

                        <div className="alert-box">
                            <strong>Policy:</strong> Pricing configured here will be applied to <strong>all</strong> {showSlots.length} slots created in this batch.
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={creating}>
                        {creating ? 'Processing Batch...' : `Create ${showSlots.length} Show(s)`}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddShow;
