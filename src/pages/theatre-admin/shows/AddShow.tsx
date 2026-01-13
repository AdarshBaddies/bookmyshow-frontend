import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { ADD_SHOW } from '../../../graphql/mutations';
import { GET_SCREENS, FETCH_THEATRE } from '../../../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './AddShow.css';

function AddShow() {
    const navigate = useNavigate();
    const [addShow, { loading: creating }] = useMutation(ADD_SHOW);

    const [fetchTheatre] = useLazyQuery(FETCH_THEATRE);
    const [getScreens] = useLazyQuery(GET_SCREENS);

    const [formData, setFormData] = useState({
        theatreId: '',
        movieId: '',
        date: '',
        showTime: '',
        screenId: '',
        layoutId: '', // Need to capture this
        lang: 'Hindi' // Default per playground example
    });

    const [availableScreens, setAvailableScreens] = useState<any[]>([]);

    const [pricing, setPricing] = useState([
        { categoryName: '', price: 0 },
    ]);

    const handleTheatreBlur = async () => {
        if (!formData.theatreId) return;
        const { data } = await getScreens({ variables: { theatreId: formData.theatreId } });
        if (data?.getScreens) {
            setAvailableScreens(data.getScreens);
        }
    };

    // Capture LayoutID when Screen is selected
    const handleScreenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedScreen = availableScreens.find(s => s.id === selectedId);
        setFormData({
            ...formData,
            screenId: selectedId,
            layoutId: selectedScreen?.layoutId || ''
        });
    };

    const handleAddPriceRow = () => {
        setPricing([...pricing, { categoryName: '', price: 0 }]);
    };

    const handleRemovePriceRow = (index: number) => {
        if (pricing.length === 1) return;
        const newPricing = pricing.filter((_, i) => i !== index);
        setPricing(newPricing);
    };

    const handlePriceChange = (index: number, field: 'categoryName' | 'price', value: string | number) => {
        const newPricing = [...pricing];
        if (field === 'categoryName') newPricing[index].categoryName = value as string;
        if (field === 'price') newPricing[index].price = Number(value);
        setPricing(newPricing);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct Dates
        // DateTime format: ISO string (e.g. 2025-11-22T02:00:00Z)
        const exactShowTime = new Date(`${formData.date}T${formData.showTime}:00`);

        // Auto-generate Publish Time (e.g., 1 hour before, or now)
        // For simplicity, let's set it to 1 day before showtime
        const publishTime = new Date(exactShowTime);
        publishTime.setDate(publishTime.getDate() - 1);

        const showDetails = [{
            screenId: formData.screenId,
            status: 1, // 1 = Open/Active (Required!)
            publishTime: publishTime.toISOString(), // (Required!)
            showTime: exactShowTime.toISOString(),
            lang: formData.lang, // (Required!)
            layoutId: formData.layoutId, // (Required!)

            categoryDetails: pricing.map((p, idx) => ({
                categoryId: idx + 1,
                categoryName: p.categoryName,
                price: parseFloat(p.price.toString()),
                currency: "INR",
                rowCount: 1, // Dummy match playground
                columnsCount: 20 // Dummy match playground
            }))
        }];

        try {
            await addShow({
                variables: {
                    date: new Date(formData.date).toISOString(),
                    movieID: formData.movieId,
                    theatreId: formData.theatreId,
                    shs: showDetails
                }
            });
            alert('Show added successfully!');
            navigate('/theatre-admin/shows');
        } catch (err: any) {
            console.error("Mutation Error:", err);
            alert('Error adding show: ' + err.message);
        }
    };

    return (
        <div className="add-show-page">
            <div className="page-header">
                <h2>Add New Show</h2>
                <button onClick={() => navigate('/theatre-admin/shows')} className="btn-back">
                    ← Back
                </button>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="show-form">
                    {/* 1. Basic Info */}
                    <div className="form-section">
                        <h3>1. Basic Info</h3>
                        <div className="form-group">
                            <label>Theatre ID *</label>
                            <input
                                type="text"
                                value={formData.theatreId}
                                onChange={e => setFormData({ ...formData, theatreId: e.target.value })}
                                onBlur={handleTheatreBlur}
                                placeholder="PVRAH" required
                            />
                        </div>
                        <div className="form-group">
                            <label>Movie ID *</label>
                            <input
                                type="text"
                                value={formData.movieId}
                                onChange={e => setFormData({ ...formData, movieId: e.target.value })}
                                placeholder="MV___" required
                            />
                        </div>
                        <div className="form-group">
                            <label>Language *</label>
                            <select
                                value={formData.lang}
                                onChange={e => setFormData({ ...formData, lang: e.target.value })}
                            >
                                <option value="Hindi">Hindi</option>
                                <option value="English">English</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                            </select>
                        </div>
                    </div>

                    {/* 2. Schedule */}
                    <div className="form-section">
                        <h3>2. Schedule</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time *</label>
                                <input
                                    type="time"
                                    value={formData.showTime}
                                    onChange={e => setFormData({ ...formData, showTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Screen Selection */}
                    <div className="form-section">
                        <h3>3. Link Screen</h3>
                        <div className="form-group">
                            <label>Select Screen *</label>
                            <select
                                value={formData.screenId}
                                onChange={handleScreenChange}
                                required
                                disabled={availableScreens.length === 0}
                            >
                                <option value="">-- Select Screen --</option>
                                {availableScreens.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {formData.layoutId && <span className="success-tag">Layout ID: {formData.layoutId}</span>}

                            {availableScreens.length === 0 && formData.theatreId && (
                                <small>Type Theatre ID to load screens</small>
                            )}
                        </div>
                    </div>

                    {/* 4. Pricing - DYNAMIC */}
                    <div className="form-section">
                        <div className="section-header-row">
                            <h3>4. Pricing Configuration</h3>
                            <button type="button" onClick={handleAddPriceRow} className="btn-add-row">
                                + Add Category
                            </button>
                        </div>

                        <div className="pricing-grid-header">
                            <span>Cat ID</span>
                            <span>Category Name</span>
                            <span>Price (INR)</span>
                            <span>Action</span>
                        </div>

                        {pricing.map((p, idx) => (
                            <div key={idx} className="price-row-dynamic">
                                <div className="cat-id-badge">
                                    #{idx + 1}
                                </div>
                                <input
                                    type="text"
                                    value={p.categoryName}
                                    onChange={(e) => handlePriceChange(idx, 'categoryName', e.target.value)}
                                    placeholder="e.g. Premium"
                                    required
                                />
                                <input
                                    type="number"
                                    value={p.price}
                                    onChange={(e) => handlePriceChange(idx, 'price', e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePriceRow(idx)}
                                    className="btn-remove-row"
                                    title="Remove Category"
                                    disabled={pricing.length === 1}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}

                        <div className="alert-box">
                            <strong>⚠️ Strategic Mapping:</strong>
                            <p>Ensure these categories match the <strong>exact order</strong> they were created in the Screen Builder.
                                Category #1 here corresponds to Block #1 in the screen layout.
                            </p>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={creating}>
                        {creating ? 'Creating Show...' : 'Create Show'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddShow;
