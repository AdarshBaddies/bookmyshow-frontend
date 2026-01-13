import { useState, useEffect } from 'react';
import { Seat } from './screenBuilderStore';
import './CategoryBlock.css';

interface CategoryBlockProps {
    blockId: string;
    name: string;
    rows: number;
    columns: number;
    seats: Seat[];
    onUpdateSeats: (seats: Seat[]) => void;
    onRemove: () => void;
}

function CategoryBlock({ blockId, name, rows, columns, seats, onUpdateSeats, onRemove }: CategoryBlockProps) {
    const [localSeats, setLocalSeats] = useState<Seat[]>(seats);
    const [selectedType, setSelectedType] = useState<number>(1); // Default paint tool

    useEffect(() => {
        setLocalSeats(seats);
    }, [seats]);

    // Auto-label seats when grid changes
    useEffect(() => {
        const labeledSeats = [...localSeats];
        const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let labelIndex = 0;

        // Logic: Label rows from A to Z
        // Label columns 1 to N
        // Skip empty seats (type 0)

        // For this category block, we'll label locally A1..A(cols) for row 1
        // In a real app, this logic might need to be global across blocks, 
        // but for now, we'll auto-label per block as per user request pattern.

        for (let r = 0; r < rows; r++) {
            const rowChar = rowLabels[r % 26]; // A, B, C...
            let seatNum = 1;

            for (let c = 0; c < columns; c++) {
                const index = r * columns + c;
                if (labeledSeats[index].type !== 0) {
                    labeledSeats[index].seatId = `${rowChar}${seatNum}`;
                    seatNum++;
                } else {
                    labeledSeats[index].seatId = '-';
                }
            }
        }

        // Only update if IDs actually changed to avoid loop
        if (JSON.stringify(labeledSeats) !== JSON.stringify(localSeats)) {
            // Defer update to parent to avoid render loop
            const timeout = setTimeout(() => onUpdateSeats(labeledSeats), 0);
            return () => clearTimeout(timeout);
        }
    }, [localSeats, rows, columns]);

    const handleSeatClick = (index: number) => {
        const newSeats = [...localSeats];
        // Toggle logic: If clicking with same type, clear to 0 (gap). Else set type.
        if (newSeats[index].type === selectedType) {
            newSeats[index].type = 0; // Make it a gap
        } else {
            newSeats[index].type = selectedType as 1 | 2 | 3;
        }
        setLocalSeats(newSeats);
        onUpdateSeats(newSeats);
    };

    return (
        <div className="category-block">
            <div className="block-header">
                <h4>{name} <span className="dim">({rows}x{columns})</span></h4>
                <div className="block-actions">
                    <div className="paint-tools">
                        <span className="tool-label">Paint:</span>
                        <button
                            className={`tool-btn type-1 ${selectedType === 1 ? 'active' : ''}`}
                            onClick={() => setSelectedType(1)}
                            title="Standard Seat"
                        />
                        <button
                            className={`tool-btn type-2 ${selectedType === 2 ? 'active' : ''}`}
                            onClick={() => setSelectedType(2)}
                            title="Premium Seat"
                        />
                        <button
                            className={`tool-btn type-3 ${selectedType === 3 ? 'active' : ''}`}
                            onClick={() => setSelectedType(3)}
                            title="Diamond Seat"
                        />
                        <button
                            className={`tool-btn type-0 ${selectedType === 0 ? 'active' : ''}`}
                            onClick={() => setSelectedType(0)}
                            title="Eraser (Gap)"
                        >✖</button>
                    </div>
                    <button onClick={onRemove} className="btn-remove-block">🗑️ Remove Block</button>
                </div>
            </div>

            <div
                className="seat-grid"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`
                }}
            >
                {localSeats.map((seat, idx) => (
                    <div
                        key={idx}
                        className={`seat-cell type-${seat.type}`}
                        onClick={() => handleSeatClick(idx)}
                        title={seat.seatId}
                    >
                        {seat.type !== 0 && <span className="seat-id">{seat.seatId}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryBlock;
