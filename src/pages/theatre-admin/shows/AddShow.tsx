import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { ADD_SHOW } from '../../../graphql/mutations';
import { GET_SCREENS, GET_MOVIES, FETCH_THEATRE, GET_SCREEN } from '../../../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './AddShow.css';

interface PricingRow {
    categoryId: number;
    categoryName: string;
    price: number;
}

interface ShowSlot {
    id: number;
    showTime: string;
    screenId: string;
    layoutId: string;
    lang: string;
    pricing: PricingRow[];
}

function AddShow() {
    const navigate = useNavigate();
    const [addShow, { loading: creating }] = useMutation(ADD_SHOW);
    const [getScreens] = useLazyQuery(GET_SCREENS);
    const [fetchTheatre] = useLazyQuery(FETCH_THEATRE);
    const [getScreen] = useLazyQuery(GET_SCREEN);

    // Fetch Movies for dropdown
    const { data: moviesData } = useQuery(GET_MOVIES, {
        variables: {
            user: { lat: 0, lon: 0, radius: 10000, movieId: "" } // Global fetch
        }
    });

    const [globalInfo, setGlobalInfo] = useState({
        theatreId: '',
        theatreName: '',
        movieId: '',
        date: '',
    });

    const [showSlots, setShowSlots] = useState<ShowSlot[]>([
        { id: Date.now(), showTime: '', screenId: '', layoutId: '', lang: 'Hindi', pricing: [] }
    ]);

    const [availableScreens, setAvailableScreens] = useState<any[]>([]);

    const handleTheatreBlur = async () => {
        if (!globalInfo.theatreId) return;
        try {
            // 1. Get Theatre Details
            const { data: tData } = await fetchTheatre({ variables: { id: globalInfo.theatreId } });
            if (tData?.fetchTheatre) {
                setGlobalInfo(prev => ({ ...prev, theatreName: tData.fetchTheatre.name }));
            }

            // 2. Get Screens
            const { data: sData } = await getScreens({ variables: { theatreId: globalInfo.theatreId } });
            if (sData?.getScreens) {
                setAvailableScreens(sData.getScreens);
            }
        } catch (err) {
            console.error("Failed to fetch theatre/screens:", err);
        }
    };

    // Slot Handlers
    const handleAddSlot = () => {
        setShowSlots([...showSlots, { id: Date.now(), showTime: '', screenId: '', layoutId: '', lang: 'Hindi', pricing: [] }]);
    };

    const handleRemoveSlot = (id: number) => {
        if (showSlots.length === 1) return;
        setShowSlots(showSlots.filter(s => s.id !== id));
    };

    const handleSlotChange = async (id: number, field: keyof ShowSlot, value: any) => {
        // Find existing slot
        const slotToUpdate = showSlots.find(s => s.id === id);
        if (!slotToUpdate) return;

        let updatedSlot = { ...slotToUpdate, [field]: value };

        if (field === 'screenId' && value) {
            const screen = availableScreens.find(s => s.id === value);
            if (screen) {
                updatedSlot.layoutId = screen.layoutId;
                // Fetch Categories
                try {
                    const { data } = await getScreen({ variables: { layoutId: screen.layoutId } });
                    if (data?.getScreen?.categories) {
                        updatedSlot.pricing = data.getScreen.categories.map((cat: any) => ({
                            categoryId: cat.catId,
                            categoryName: cat.name,
                            price: 0
                        }));
                    }
                } catch (e) {
                    console.error("Failed to fetch categories", e);
                }
            }
        }

        setShowSlots(showSlots.map(s => s.id === id ? updatedSlot : s));
    };

    const handleSlotPriceChange = (slotId: number, catId: number, price: number) => {
        setShowSlots(showSlots.map(slot => {
            if (slot.id === slotId) {
                return {
                    ...slot,
                    pricing: slot.pricing.map(p => p.categoryId === catId ? { ...p, price } : p)
                };
            }
            return slot;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (showSlots.some(s => !s.showTime || !s.screenId || s.pricing.some(p => p.price <= 0))) {
            const confirmZero = window.confirm("Some prices are 0 or slots are incomplete. Continue?");
            if (!confirmZero) return;
        }

        const showDetails = showSlots.map(slot => {
            const exactShowTime = new Date(`${globalInfo.date}T${slot.showTime}:00`);
            const publishTime = new Date(exactShowTime);
            publishTime.setHours(publishTime.getHours() - 24);

            return {
                screenId: slot.screenId,
                status: 1,
                publishTime: publishTime.toISOString(),
                showTime: exactShowTime.toISOString(),
                lang: slot.lang,
                layoutId: slot.layoutId,
                categoryDetails: slot.pricing.map(p => ({
                    categoryId: p.categoryId,
                    categoryName: p.categoryName,
                    price: parseFloat(p.price.toString()),
                    currency: "INR",
                    rowCount: 1,
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
                            {globalInfo.theatreName && <div className="theatre-meta">Theatre: <strong>{globalInfo.theatreName}</strong></div>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Select Movie *</label>
                                <select
                                    value={globalInfo.movieId}
                                    onChange={e => setGlobalInfo({ ...globalInfo, movieId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose Movie --</option>
                                    {moviesData?.getMovies?.map((m: any) => (
                                        <option key={m.movieId} value={m.movieId}>{m.title}</option>
                                    ))}
                                </select>
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
                                    <div className="slot-main-fields">
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

                                    {/* Pricing categories for THIS slot */}
                                    {slot.pricing.length > 0 && (
                                        <div className="slot-pricing-section">
                                            <h4>Set Pricing</h4>
                                            <div className="slot-pricing-grid">
                                                {slot.pricing.map(p => (
                                                    <div key={p.categoryId} className="slot-price-row">
                                                        <span className="cat-name">{p.categoryName}</span>
                                                        <input
                                                            type="number"
                                                            value={p.price}
                                                            onChange={e => handleSlotPriceChange(slot.id, p.categoryId, Number(e.target.value))}
                                                            placeholder="Price (INR)"
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
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
