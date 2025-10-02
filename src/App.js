//Key Imports
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";

// Logo mappings
const TEAM_LOGOS = {
    "Liverpool": "https://resources.premierleague.com/premierleague/badges/50/t14.png",
    "Arsenal": "https://resources.premierleague.com/premierleague/badges/50/t3.png",
    "Aston-Villa": "https://resources.premierleague.com/premierleague/badges/50/t7.png",
    "Aston Villa": "https://resources.premierleague.com/premierleague/badges/50/t7.png",
    "Bournemouth": "https://resources.premierleague.com/premierleague/badges/50/t91.png",
    "Brentford": "https://resources.premierleague.com/premierleague/badges/50/t94.png",
    "Brighton-and-Hove-Albion": "https://resources.premierleague.com/premierleague/badges/50/t36.png",
    "Brighton": "https://resources.premierleague.com/premierleague/badges/50/t36.png",
    "Burnley": "https://resources.premierleague.com/premierleague/badges/50/t90.png",
    "Chelsea": "https://resources.premierleague.com/premierleague/badges/50/t8.png",
    "Crystal-Palace": "https://resources.premierleague.com/premierleague/badges/50/t31.png",
    "Crystal Palace": "https://resources.premierleague.com/premierleague/badges/50/t31.png",
    "Everton": "https://resources.premierleague.com/premierleague/badges/50/t11.png",
    "Fulham": "https://resources.premierleague.com/premierleague/badges/50/t54.png",
    "Ipswich-Town": "https://resources.premierleague.com/premierleague/badges/50/t40.png",
    "Leeds-United": "https://resources.premierleague.com/premierleague/badges/50/t2.png",
    "Leeds": "https://resources.premierleague.com/premierleague/badges/50/t2.png",
    "Leicester-City": "https://resources.premierleague.com/premierleague/badges/50/t13.png",
    "Manchester-City": "https://resources.premierleague.com/premierleague/badges/50/t43.png",
    "Man City": "https://resources.premierleague.com/premierleague/badges/50/t43.png",
    "Manchester-United": "https://resources.premierleague.com/premierleague/badges/50/t1.png",
    "Man United": "https://resources.premierleague.com/premierleague/badges/50/t1.png",
    "Newcastle-United": "https://resources.premierleague.com/premierleague/badges/50/t4.png",
    "Newcastle": "https://resources.premierleague.com/premierleague/badges/50/t4.png",
    "Nottingham-Forest": "https://resources.premierleague.com/premierleague/badges/50/t17.png",
    "Nott'm Forest": "https://resources.premierleague.com/premierleague/badges/50/t17.png",
    "Southampton": "https://resources.premierleague.com/premierleague/badges/50/t20.png",
    "Sunderland": "https://resources.premierleague.com/premierleague/badges/50/t56.png",
    "Tottenham-Hotspur": "https://resources.premierleague.com/premierleague/badges/50/t6.png",
    "Tottenham": "https://resources.premierleague.com/premierleague/badges/50/t6.png",
    "West-Ham-United": "https://resources.premierleague.com/premierleague/badges/50/t21.png",
    "West Ham": "https://resources.premierleague.com/premierleague/badges/50/t21.png",
    "Wolverhampton-Wanderers": "https://resources.premierleague.com/premierleague/badges/50/t39.png",
    "Wolves": "https://resources.premierleague.com/premierleague/badges/50/t39.png"
};

const NATION_FLAGS = {
    "ENG": "gb-eng", "SCO": "gb-sct", "WAL": "gb-wls", "NIR": "gb-nir",
    "FRA": "fr", "NED": "nl", "BRA": "br", "ESP": "es", "POR": "pt",
    "GER": "de", "ARG": "ar", "ITA": "it", "DEN": "dk", "BEL": "be",
    "SWE": "se", "NOR": "no", "CIV": "ci", "IRL": "ie", "NGA": "ng",
    "SEN": "sn", "USA": "us", "MAR": "ma", "SUI": "ch", "JPN": "jp",
    "SRB": "rs", "COL": "co", "CMR": "cm", "POL": "pl", "CRO": "hr",
    "URU": "uy", "CZE": "cz", "MEX": "mx", "COD": "cd", "PAR": "py",
    "HUN": "hu", "EGY": "eg", "ECU": "ec", "GHA": "gh", "AUT": "at",
    "UKR": "ua", "BFA": "bf", "KOR": "kr", "TUR": "tr", "GRE": "gr",
    "SVN": "si", "GEO": "ge", "ISR": "il", "GNB": "gw", "MOZ": "mz",
    "ALG": "dz", "UZB": "uz", "TRI": "tt", "JAM": "jm", "ISL": "is",
    "GAM": "gm", "NZL": "nz", "BUL": "bg", "SVK": "sk", "RSA": "za",
    "TUN": "tn", "PER": "pe", "ALB": "al", "ZIM": "zw", "HAI": "ht"
};

const getPositionIcon = (position) => {
    const icons = {
        "GK": "🧤",
        "DF": "🛡️",
        "MF": "⚙️",
        "FW": "⚡",
        "FW,MF": "🎯",
        "MF,FW": "🧭",
        "DF,MF": "🏗️",
        "MF,DF": "🔗",
        "DF,FW": "⚔️",
        "FW,DF": "🦅"

    };

    return icons[position] || "👤";
};


const getTeamLogo = (teamName) => TEAM_LOGOS[teamName] || "";
const getNationFlag = (nation) => {
    const countryCode = NATION_FLAGS[nation];
    return countryCode ? `https://flagcdn.com/w40/${countryCode}.png` : "";
};


// Player Recommendation  -----------------------------------------------------------------------------------

const getPlayerRecommendation = (player) => {
    const goalsPerGame = (player.goals || 0) / (player.matches_played || 1);
    const assistsPerGame = (player.assists || 0) / (player.matches_played || 1);
    const minutesPerGame = (player.minutes_played || 0) / (player.matches_played || 1);
    const startsRatio = (player.starts || 0) / (player.matches_played || 1);

    let score = 0;
    let reasons = [];

    // Scoring based on position
    if (player.position === 'FW' || player.position === 'FW,MF') {
        if (goalsPerGame >= 0.5) { score += 3; reasons.push('Excellent goal scoring rate'); }
        else if (goalsPerGame >= 0.3) { score += 2; reasons.push('Good goal scoring rate'); }
        else { score -= 1; reasons.push('Low goal output'); }
    }

    if (player.position === 'MF' || player.position.includes('MF')) {
        if (assistsPerGame >= 0.3) { score += 2; reasons.push('Great playmaking ability'); }
        if (goalsPerGame >= 0.2) { score += 2; reasons.push('Contributes goals from midfield'); }
    }

    if (player.position === 'DF' || player.position === 'GK') {
        if (startsRatio >= 0.8) { score += 2; reasons.push('Solid defensive contribution'); }
        if (minutesPerGame >= 80) { score += 1; reasons.push('Plays full matches'); }
        score += 1;

    }

    if (startsRatio >= 0.8) { score += 2; reasons.push('Regular starter'); }
    else if (startsRatio < 0.5) { score -= 1; reasons.push('Limited playing time'); }

    if (minutesPerGame >= 80) { score += 1; reasons.push('Plays full matches'); }

    if ((player.goals || 0) + (player.assists || 0) >= 10) {
        score += 2;
        reasons.push('High goal contributions');
    }

    if (score >= 5) return { rating: 'Excellent Pick', color: '#4ade80', reasons };
    if (score >= 3) return { rating: 'Good Pick', color: '#fbbf24', reasons };
    if (score >= 1) return { rating: 'Decent Option', color: '#fb923c', reasons };
    return { rating: 'Risky Pick', color: '#ef4444', reasons };
};


// Search Players -----------------------------------------------------------------------------------
function SearchPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);

            let { data, error } = await supabase.from("player_statistic").select("*");
            if (error) throw error;
            setPlayers(data);

            setError(null);
        } catch (err) {
            setError('Failed to fetch players. Make sure your backend is running.');
            console.error('Error fetching players:', err);
        } finally {
            setLoading(false);
        }
    };


    const filteredPlayers = players.filter(player =>
        player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-content">
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-box"
                />
            </div>

            {loading && <div className="loading-message">Loading players...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="table-container">
                    <div className="table-header-row">
                        <div className="table-title">Players</div>
                        <div className="table-count">{filteredPlayers.length} found</div>
                    </div>
                    <div className="data-table">
                        {filteredPlayers.map((player, index) => (
                            <div key={`${player.name}-${index}`}>
                                <div
                                    className="table-row"
                                    onClick={() => setSelectedPlayer(selectedPlayer?.name === player.name ? null : player)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="row-main">
                                        <div className="player-info-cell">
                                            <div className="player-avatar">{player.name.substring(0, 2).toUpperCase()}</div>
                                            <div className="player-text">
                                                <div className="player-name-text">
                                                    {player.name}
                                                </div>
                                                <div className="player-meta-text">
                                                    {getTeamLogo(player.team_name) && (
                                                        <img src={getTeamLogo(player.team_name)} alt={player.team_name} style={{width: '20px', height: '20px', marginRight: '6px', verticalAlign: 'middle'}} />
                                                    )}
                                                    {player.team_name} · {player.position}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="stats-cell">
                                            <div className="stat-group">
                                                <span className="stat-num">{player.goals || 0}</span>
                                                <span className="stat-lbl">G</span>
                                            </div>
                                            <div className="stat-group">
                                                <span className="stat-num">{player.assists || 0}</span>
                                                <span className="stat-lbl">A</span>
                                            </div>
                                            <div className="stat-group">
                                                <span className="stat-num">{player.minutes_played || 0}</span>
                                                <span className="stat-lbl">MIN</span>
                                            </div>
                                            <div className="stat-group">
                                                <span className="stat-num">{player.starts || 0}/{player.matches_played || 0}</span>
                                                <span className="stat-lbl">ST</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedPlayer?.name === player.name && (
                                    <div className="squad-expansion">
                                        <div className="player-details" style={{ padding: '1.5rem' }}>
                                            <p><strong>Team:</strong> {selectedPlayer.team_name}</p>
                                            <p><strong>Position:</strong> {selectedPlayer.position}</p>
                                            <p><strong>Stats:</strong> {selectedPlayer.goals || 0}G / {selectedPlayer.assists || 0}A in {selectedPlayer.matches_played || 0} matches</p>
                                        </div>
                                        {(() => {
                                            const rec = getPlayerRecommendation(selectedPlayer);
                                            return (
                                                <div className="recommendation-box" style={{borderColor: rec.color, margin: '0 1.5rem 1.5rem 1.5rem'}}>
                                                    <h3 style={{color: rec.color}}>{rec.rating}</h3>
                                                    <ul className="recommendation-reasons">
                                                        {rec.reasons.map((reason, idx) => (
                                                            <li key={idx}>{reason}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedPlayer && (
                <div className="player-modal" onClick={() => setSelectedPlayer(null)}>
                    <div className="player-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedPlayer(null)}>×</button>
                        <h2>{selectedPlayer.name}</h2>
                        <div className="player-details">
                            <p><strong>Team:</strong> {selectedPlayer.team_name}</p>
                            <p><strong>Position:</strong> {selectedPlayer.position}</p>
                            <p><strong>Stats:</strong> {selectedPlayer.goals || 0}G / {selectedPlayer.assists || 0}A in {selectedPlayer.matches_played || 0} matches</p>
                        </div>
                        {(() => {
                            const rec = getPlayerRecommendation(selectedPlayer);
                            return (
                                <div className="recommendation-box" style={{borderColor: rec.color}}>
                                    <h3 style={{color: rec.color}}>{rec.rating}</h3>
                                    <ul className="recommendation-reasons">
                                        {rec.reasons.map((reason, idx) => (
                                            <li key={idx}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}

// Welcome -----------------------------------------------------------------------------------
function Welcome() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get('http://localhost:1212/api/v1/player');
            const playerData = response.data;
            setPlayers(playerData);

            const topScorer = playerData.reduce((max, player) =>
                (player.goals || 0) > (max.goals || 0) ? player : max, playerData[0] || {});

            const topAssister = playerData.reduce((max, player) =>
                (player.assists || 0) > (max.assists || 0) ? player : max, playerData[0] || {});

            const totalGoals = playerData.reduce((sum, player) => sum + (player.goals || 0), 0);
            const totalAssists = playerData.reduce((sum, player) => sum + (player.assists || 0), 0);

            const teamCount = new Set(playerData.map(p => p.team_name)).size;
            const nationCount = new Set(playerData.map(p => p.nation)).size;

            const workhorse = playerData.reduce((max, player) =>
                (player.minutes_played || 0) > (max.minutes_played || 0) ? player : max, playerData[0] || {});

            setStats({
                topScorer,
                topAssister,
                workhorse,
                totalGoals,
                totalAssists,
                totalPlayers: playerData.length,
                teamCount,
                nationCount
            });

        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-message">Loading Premier League Data...</div>;
    }

    const topScorers = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 5);
    const topAssisters = [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0)).slice(0, 5);

    return (
        <div className="page-content">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-value">{stats.totalPlayers || 0}</div>
                    <div className="stat-card-label">Players Tracked</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value">{stats.teamCount || 0}</div>
                    <div className="stat-card-label">Teams</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value">{stats.nationCount || 0}</div>
                    <div className="stat-card-label">Nations</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value">{stats.totalGoals || 0}</div>
                    <div className="stat-card-label">Total Goals</div>
                </div>
            </div>

            <div className="content-row">
                <div className="content-card">
                    <div className="card-header">
                        <h3 className="card-title">Top Scorers</h3>
                    </div>
                    <div className="leader-list">
                        {topScorers.map((player, idx) => (
                            <div key={idx} className="leader-item">
                                <div className="leader-rank">{idx + 1}</div>
                                <div className="leader-info">
                                    <div className="leader-name">{player.name}</div>
                                    <div className="leader-team">
                                        {getTeamLogo(player.team_name) && (
                                            <img src={getTeamLogo(player.team_name)} alt={player.team_name} style={{width: '18px', height: '18px', marginRight: '4px', verticalAlign: 'middle'}} />
                                        )}
                                        {player.team_name}
                                    </div>
                                </div>
                                <div className="leader-stat">{player.goals || 0}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h3 className="card-title">Top Assisters</h3>
                    </div>
                    <div className="leader-list">
                        {topAssisters.map((player, idx) => (
                            <div key={idx} className="leader-item">
                                <div className="leader-rank">{idx + 1}</div>
                                <div className="leader-info">
                                    <div className="leader-name">{player.name}</div>
                                    <div className="leader-team">
                                        {getTeamLogo(player.team_name) && (
                                            <img src={getTeamLogo(player.team_name)} alt={player.team_name} style={{width: '18px', height: '18px', marginRight: '4px', verticalAlign: 'middle'}} />
                                        )}
                                        {player.team_name}
                                    </div>
                                </div>
                                <div className="leader-stat">{player.assists || 0}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getRankColor(idx, totalTeams) {
    const ratio = idx / totalTeams;
    if (ratio < 0.2) return "rank-blue";     // Top 20%
    if (ratio < 0.4) return "rank-green";    // Next 20%
    if (ratio < 0.6) return "rank-yellow";   // Middle 20%
    if (ratio < 0.8) return "rank-orange";   // Next 20%
    return "rank-red";                       // Bottom 20%
}



// Teams -----------------------------------------------------------------------------------
function Teams() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:1212/api/v1/player');
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch players.');
            console.error('Error fetching players:', err);
        } finally {
            setLoading(false);
        }
    };

    const teamStats = players.reduce((acc, player) => {
        const team = player.team_name || 'Unknown';
        if (!acc[team]) {
            acc[team] = {
                players: [],
                totalGoals: 0,
                totalAssists: 0,
                count: 0
            };
        }
        acc[team].players.push(player);
        acc[team].totalGoals += player.goals || 0;
        acc[team].totalAssists += player.assists || 0;
        acc[team].count += 1;
        return acc;
    }, {});

    const sortedTeams = Object.entries(teamStats).sort(([,a], [,b]) => b.totalGoals - a.totalGoals);

    console.log("Team names in database:", sortedTeams.map(([team]) => team));

    return (
        <div className="page-content">
            {loading && <div className="loading-message">Loading teams data...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="table-container">
                    <div className="table-header-row">
                        <div className="table-title">
                            Teams <span className="subtitle">(Ranked by Goals & Assists)</span>
                        </div>
                        <div className="table-count">{sortedTeams.length} teams</div>
                    </div>

                    <div className="league-table">
                        <div className="league-table-header">
                            <div className="col-rank">#</div>
                            <div className="col-team">Team</div>
                            <div className="col-stat">PL</div>
                            <div className="col-stat">G</div>
                            <div className="col-stat">A</div>
                        </div>
                        {sortedTeams.map(([team, stats], idx) => (
                            <div key={team}>
                                <div
                                    className={`league-table-row ${selectedTeam === team ? 'row-expanded' : ''}`}
                                    onClick={() => setSelectedTeam(selectedTeam === team ? '' : team)}
                                >
                                    <div className="col-rank">
                                        <div className={`rank-badge ${getRankColor(idx, sortedTeams.length)}`}>
                                            {idx + 1}
                                        </div>

                                    </div>
                                    <div className="col-team">
                                        <div className="team-badge">
                                            {getTeamLogo(team) ? (
                                                <img src={getTeamLogo(team)} alt={team} style={{width: '100%', height: '100%', objectFit: 'contain', padding: '4px'}} />
                                            ) : (
                                                team.substring(0, 3).toUpperCase()
                                            )}
                                        </div>
                                        <span className="team-name-full">{team}</span>
                                    </div>
                                    <div className="col-stat">{stats.count}</div>
                                    <div className="col-stat stat-highlight">{stats.totalGoals}</div>
                                    <div className="col-stat stat-highlight">{stats.totalAssists}</div>
                                </div>

                                {selectedTeam === team && (
                                    <div className="squad-expansion">
                                        {stats.players.sort((a, b) => (b.goals || 0) - (a.goals || 0)).map((player, pIdx) => (
                                            <div key={pIdx} className="squad-player-row">
                                                <div className="squad-player-name">{player.name}</div>
                                                <div className="squad-player-pos">{player.position}</div>
                                                <div className="squad-player-stats">
                                                    <span>{player.goals || 0}G</span>
                                                    <span> </span>
                                                    <span>{player.assists || 0}A</span>
                                                    <span> </span>
                                                    <span>{player.minutes_played || 0}min</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Positions -----------------------------------------------------------------------------------
function Positions() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState('');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:1212/api/v1/player');
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch players.');
        } finally {
            setLoading(false);
        }
    };

    const positionStats = players.reduce((acc, player) => {
        const position = player.position || 'Unknown';
        if (!acc[position]) {
            acc[position] = { players: [], totalGoals: 0, totalAssists: 0, count: 0 };
        }
        acc[position].players.push(player);
        acc[position].totalGoals += player.goals || 0;
        acc[position].totalAssists += player.assists || 0;
        acc[position].count += 1;
        return acc;
    }, {});

    const sortedPositions = Object.entries(positionStats)
        .map(([position, stats]) => ({
            position,
            ...stats,
            avgGoals: (stats.totalGoals / stats.count).toFixed(1),
            avgAssists: (stats.totalAssists / stats.count).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count);

    console.log("Position names in database:", sortedPositions.map(p => p.position));


    return (
        <div className="page-content">
            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="table-container">
                    <div className="table-header-row">
                        <div className="table-title">Positions</div>
                    </div>

                    <div className="league-table">
                        <div className="league-table-header">
                            <div className="col-team">Position</div>
                            <div className="col-stat">Players</div>
                            <div className="col-stat">Avg G</div>
                            <div className="col-stat">Avg A</div>
                            <div className="col-stat">Total</div>
                        </div>
                        {sortedPositions.map((posData) => (
                            <div key={posData.position}>
                                <div
                                    className={`league-table-row ${selectedPosition === posData.position ? 'row-expanded' : ''}`}
                                    onClick={() => setSelectedPosition(selectedPosition === posData.position ? '' : posData.position)}
                                >
                                    <div className="col-team">
                                        <div className="team-badge" style={{fontSize: '1.2rem'}}>
                                            {getPositionIcon(posData.position)}
                                        </div>
                                        <span className="team-name-full">{posData.position}</span>
                                    </div>
                                    <div className="col-stat">{posData.count}</div>
                                    <div className="col-stat stat-highlight">{posData.avgGoals}</div>
                                    <div className="col-stat stat-highlight">{posData.avgAssists}</div>
                                    <div className="col-stat">{posData.totalGoals}</div>
                                </div>

                                {selectedPosition === posData.position && (
                                    <div className="squad-expansion">
                                        {posData.players.sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 10).map((player, idx) => (
                                            <div key={idx} className="squad-player-row">
                                                <div className="squad-player-name">{player.name}</div>
                                                <div className="squad-player-pos">{player.team_name}</div>
                                                <div className="squad-player-stats">
                                                    <span>{player.goals || 0}G</span>
                                                    <span> </span>
                                                    <span>{player.assists || 0}A</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
// Nations -----------------------------------------------------------------------------------
function Nations() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNation, setSelectedNation] = useState('');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:1212/api/v1/player');            
            setPlayers(response.data);
            console.log('Nations data loaded:', response.data.length, 'players');
            setError(null);
        } catch (err) {
            setError('Failed to fetch players.');
        } finally {
            setLoading(false);
        }
    };

    const nationStats = players.reduce((acc, player) => {
        const nation = player.nation ? player.nation.split(' ')[1] || player.nation : 'Unknown';
        if (!acc[nation]) {
            acc[nation] = { players: [], totalGoals: 0, totalAssists: 0, count: 0 };
        }
        acc[nation].players.push(player);
        acc[nation].totalGoals += player.goals || 0;
        acc[nation].totalAssists += player.assists || 0;
        acc[nation].count += 1;
        return acc;
    }, {});

    const sortedNations = Object.entries(nationStats).sort(([,a], [,b]) => b.count - a.count);

    console.log("Nation names in database:", sortedNations.map(([nation]) => nation));

    return (
        <div className="page-content">
            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="table-container">
                    <div className="table-header-row">
                        <div className="table-title">Nations</div>
                        <div className="table-count">{sortedNations.length} nations</div>
                    </div>

                    <div className="league-table">
                        <div className="league-table-header">
                            <div className="col-rank">#</div>
                            <div className="col-team">Nation</div>
                            <div className="col-stat">Players</div>
                            <div className="col-stat">Goals</div>
                            <div className="col-stat">Assists</div>
                        </div>
                        {sortedNations.map(([nation, stats], idx) => (
                            <div key={nation}>
                                <div
                                    className={`league-table-row ${selectedNation === nation ? 'row-expanded' : ''}`}
                                    onClick={() => setSelectedNation(selectedNation === nation ? '' : nation)}
                                >
                                    <div className="col-rank">
                                        <div className="rank-badge">{idx + 1}</div>
                                    </div>
                                    <div className="col-team">
                                        <div className="team-badge">
                                            {getNationFlag(nation) ? (
                                                <img src={getNationFlag(nation)} alt={nation} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} />
                                            ) : (
                                                nation.substring(0, 3).toUpperCase()
                                            )}
                                        </div>
                                        <span className="team-name-full">{nation}</span>
                                    </div>
                                    <div className="col-stat">{stats.count}</div>
                                    <div className="col-stat stat-highlight">{stats.totalGoals}</div>
                                    <div className="col-stat stat-highlight">{stats.totalAssists}</div>
                                </div>

                                {selectedNation === nation && (
                                    <div className="squad-expansion">
                                        {stats.players.sort((a, b) => (b.goals || 0) - (a.goals || 0)).map((player, idx) => (
                                            <div key={idx} className="squad-player-row">
                                                <div className="squad-player-name">{player.name}</div>
                                                <div className="squad-player-pos">{player.team_name} - {player.position}</div>
                                                <div className="squad-player-stats">
                                                    <span>{player.goals || 0}G</span>
                                                    <span> </span>
                                                    <span>{player.assists || 0}A</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Prediction -----------------------------------------------------------------------------------
function Prediction() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get("http://localhost:1212/api/v1/predictions");

            setPredictions(response.data);
            console.log("Prediction team names:", response.data.map(p => p.teamName));

        } catch (err) {
            console.error(err);
            setError("Failed to load predictions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPredictions();
    }, []);

    return (
        <div className="page-content">
            <div className="prediction-header">
                <button
                    className="generate-btn"
                    onClick={fetchPredictions}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Predictions"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {predictions.length > 0 && (
                <div className="table-container">
                    <div className="table-header-row">
                        <div className="table-title">2025-26 Predicted Table</div>
                    </div>

                    <div className="league-table">
                        <div className="league-table-header">
                            <div className="col-rank">#</div>
                            <div className="col-team">Team</div>
                            <div className="col-stat">PTS</div>
                        </div>

                        {predictions.map((pred) => {
                            const logo = getTeamLogo(pred.teamName);

                            return (
                                <div key={pred.id} className="league-table-row">
                                    <div className="col-rank">
                                        <div
                                            className={`rank-badge 
                                                ${pred.predictedRank <= 4 ? "rank-blue" : ""}
                                                ${pred.predictedRank > 4 && pred.predictedRank <= 6 ? "rank-green" : ""}
                                                ${pred.predictedRank > 6 && pred.predictedRank <= 10 ? "rank-yellow" : ""}
                                                ${pred.predictedRank > 10 && pred.predictedRank <= 17 ? "rank-orange" : ""}
                                                ${pred.predictedRank >= 18 ? "rank-red" : ""}
                                            `}
                                        >
                                            {pred.predictedRank}
                                        </div>
                                    </div>

                                    <div className="col-team">
                                        <div className="team-badge">
                                            {logo ? (
                                                <img
                                                    src={logo}
                                                    alt={pred.teamName}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                        padding: "4px",
                                                    }}
                                                />
                                            ) : (
                                                pred.teamName.substring(0, 3).toUpperCase()
                                            )}
                                        </div>
                                        <span className="team-name-full">{pred.teamName}</span>
                                    </div>

                                    <div className="col-stat stat-bold">
                                        {Math.round(pred.predictedPoints)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="prediction-footer">
                        Based on RandomForest model trained on 2020-2024 PL data
                    </div>
                </div>
            )}
        </div>
    );
}

// APP -----------------------------------------------------------------------------------
function App() {
    const [activeTab, setActiveTab] = useState('/');

    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <div className="header-content">
                        <h1 className="app-logo">THE 12TH MAN</h1>
                    </div>
                </header>

                <div className="league-header">
                    <div className="league-info">
                        <div className="league-badge">
                            <img
                                src="/EnglishPremierLeague.png"
                                alt="Premier League"
                                style={{width: '100%', height: '100%', objectFit: 'contain'}}
                            />
                        </div>
                        <div className="league-text">
                            <h2 className="league-name">Premier League</h2>
                            <div className="league-country">England</div>
                        </div>
                    </div>
                    <div className="season-selector">2025/2026</div>
                </div>

                <nav className="main-nav">
                    <div className="nav-content">
                        {[
                            { path: '/', label: 'Overview' },
                            { path: '/teams', label: 'Teams' },
                            { path: '/positions', label: 'Positions' },
                            { path: '/nations', label: 'Nations' },
                            { path: '/search', label: 'Search' },
                            { path: '/prediction', label: 'Prediction' }
                        ].map(({ path, label }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setActiveTab(path)}
                                className={`nav-tab ${activeTab === path ? 'nav-tab-active' : ''}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/positions" element={<Positions />} />
                        <Route path="/nations" element={<Nations />} />
                        <Route path="/search" element={<SearchPlayers />} />
                        <Route path="/prediction" element={<Prediction />} />
                    </Routes>
                </main>

                <style>{`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    .app-container {
                        background: #181818;
                        background-image: 
                            radial-gradient(circle at 20% 50%, rgba(233, 0, 82, 0.05) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(61, 25, 91, 0.05) 0%, transparent 50%),
                            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(233, 0, 82, 0.03) 2px, rgba(233, 0, 82, 0.03) 4px);
                        min-height: 100vh;
                        color: #fff;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    }

                    .app-header {
                        background: linear-gradient(135deg, #1f1f1f 0%, #252525 100%);
                        border-bottom: 1px solid #2a2a2a;
                        padding: 1rem 0;
                        position: relative;
                        overflow: hidden;
                    }

                    .app-header::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(233, 0, 82, 0.1), transparent);
                        animation: shimmer 3s infinite;
                    }

                    @keyframes shimmer {
                        0% { left: -100%; }
                        100% { left: 200%; }
                    }

                    .header-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 1.5rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .app-logo {
                        font-size: 1.3rem;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                        background: linear-gradient(135deg, #ff1a75, #c026d3, #e879f9);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .league-header {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 2rem 1.5rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .league-info {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }

                    .league-badge {
                        width: 80px;
                        height: 80px;
                        background: #fff;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0px;
                        box-shadow: 0 4px 20px rgba(233, 0, 82, 0.4);
                        animation: pulse 3s ease-in-out infinite;
                    }

                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }

                    .league-name {
                        font-size: 1.8rem;
                        font-weight: 700;
                        margin-bottom: 0.25rem;
                    }

                    .league-country {
                        color: #888;
                        font-size: 0.9rem;
                    }

                    .season-selector {
                        background: linear-gradient(135deg, #2a2a2a, #242424);
                        padding: 0.6rem 1.2rem;
                        border-radius: 8px;
                        font-size: 0.95rem;
                        cursor: pointer;
                        border: 1px solid #333;
                        transition: all 0.3s ease;
                    }

                    .season-selector:hover {
                        border-color: #e90052;
                        box-shadow: 0 0 15px rgba(233, 0, 82, 0.2);
                        transform: translateY(-2px);
                    }

                    .main-nav {
                        background: #1f1f1f;
                        border-bottom: 1px solid #2a2a2a;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                    }

                    .nav-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 1.5rem;
                        display: flex;
                        gap: 0.5rem;
                    }

                    .nav-tab {
                        padding: 1rem 1.2rem;
                        color: #888;
                        text-decoration: none;
                        font-size: 0.95rem;
                        font-weight: 500;
                        border-bottom: 2px solid transparent;
                        transition: all 0.2s;
                    }

                    .nav-tab:hover {
                        color: #fff;
                    }

                    .nav-tab-active {
                        color: #fff;
                        border-bottom-color: #e90052;
                        position: relative;
                    }
                    
                    .nav-tab-active::after {
                        content: '';
                        position: absolute;
                        bottom: -2px;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background: linear-gradient(90deg, #e90052, #3d195b);
                        box-shadow: 0 0 10px rgba(233, 0, 82, 0.5);
                    }

                    .main-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 1.5rem;
                    }

                    .page-content {
                        animation: fadeIn 0.2s ease;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }

                    .stat-card {
                        background: linear-gradient(135deg, #2a2a2a, #242424);
                        border-radius: 12px;
                        padding: 1.5rem;
                        border: 1px solid #333;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }

                    .stat-card:before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, #e90052, #3d195b);
                        transform: scaleX(0);
                        transition: transform 0.3s ease;
                    }
                    
                    .stat-card:hover {
                        transform: translateY(-4px);
                        border-color: #e90052;
                        box-shadow: 0 8px 30px rgba(233, 0, 82, 0.2);
                    }

                    .stat-card:hover::before {
                        transform: scaleX(1);
                    }
                    
                    .subtitle {
                    font-size: 0.9rem;
                    color: #666;
                    font-weight: normal;
                }

                    .stat-card-value {
                        font-size: 2rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #e90052, #3d195b);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 0.5rem;
                    }

                    .stat-card-label {
                        color: #888;
                        font-size: 0.9rem;
                    }

                    .content-row {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1rem;
                    }

                    .content-card {
                        background: linear-gradient(135deg, #2a2a2a, #242424);
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid #333;
                        transition: all 0.3s ease;
                    }

                    .content-card:hover {
                        border-color: #e90052;
                        box-shadow: 0 8px 30px rgba(233, 0, 82, 0.15);
                        transform: translateY(-2px);
                    }

                    .card-header {
                        padding: 1rem 1.25rem;
                        border-bottom: 1px solid #333;
                    }

                    .card-title {
                        font-size: 1.1rem;
                        font-weight: 600;
                    }

                    .leader-list {
                        padding: 0.5rem 0;
                    }

                    .leader-item {
                        display: flex;
                        align-items: center;
                        padding: 0.75rem 1.25rem;
                        gap: 1rem;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }

                    .leader-item::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        width: 3px;
                        background: linear-gradient(180deg, #e90052, #3d195b);
                        transform: scaleY(0);
                        transition: transform 0.3s ease;
                    }

                    .leader-item:hover {
                        background: #2a2a2a;
                        transform: translateX(8px);
                    }

                    .leader-item:hover::before {
                        transform: scaleY(1);
                    }

                    .leader-rank {
                        width: 24px;
                        height: 24px;
                        background: linear-gradient(135deg, #e90052, #3d195b);
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: #fff;
                        box-shadow: 0 2px 8px rgba(233, 0, 82, 0.3);
                    }

                    .leader-info {
                        flex: 1;
                    }

                    .leader-name {
                        font-size: 0.95rem;
                        font-weight: 500;
                        margin-bottom: 0.2rem;
                    }

                    .leader-team {
                        font-size: 0.8rem;
                        color: #888;
                    }

                    .leader-stat {
                        font-size: 1.1rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #ff1a75, #c026d3, #e879f9);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .table-container {
                        background: linear-gradient(135deg, #2a2a2a, #242424);
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid #333;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    }

                    .table-header-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1rem 1.25rem;
                        border-bottom: 1px solid #333;
                    }

                    .table-title {
                        font-size: 1.1rem;
                        font-weight: 600;
                    }

                    .table-count {
                        color: #888;
                        font-size: 0.9rem;
                    }

                    .league-table {
                        overflow-x: auto;
                    }

                    .league-table-header {
                        display: grid;
                        grid-template-columns: 50px 1fr 60px 60px 60px;
                        padding: 0.75rem 1.25rem;
                        font-size: 0.8rem;
                        font-weight: 600;
                        color: #888;
                        text-transform: uppercase;
                        border-bottom: 1px solid #333;
                    }

                    .league-table-row {
                        display: grid;
                        grid-template-columns: 50px 1fr 60px 60px 60px;
                        padding: 0.75rem 1.25rem;
                        border-bottom: 1px solid #333;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        align-items: center;
                    }

                    .league-table-row:hover {
                        background: linear-gradient(90deg, #333, #2e2e2e);
                        transform: translateX(4px);
                    }

                    .league-table-row:last-child {
                        border-bottom: none;
                    }
                  
                  .rank-badge.rank-blue { background-color: #007bff !important; color: white !important; }
                    .rank-badge.rank-green { background-color: #28a745 !important; color: white !important; }
                    .rank-badge.rank-yellow { background-color: #ffc107 !important; color: black !important; }
                    .rank-badge.rank-orange { background-color: #fd7e14 !important; color: white !important; }
                    .rank-badge.rank-red { background-color: #dc3545 !important; color: white !important; }


                    .row-expanded {
                        background: #333;
                    }

                    .col-rank {
                        display: flex;
                        align-items: center;
                    }

                    .rank-badge {
                        width: 32px;
                        height: 32px;
                        background: #2a2a2a;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.9rem;
                        font-weight: 700;
                        border: 2px solid #333;
                        transition: all 0.3s ease;
                    }

                    .rank-top {
                        background: linear-gradient(135deg, #e90052, #3d195b);
                        color: #fff;
                        border-color: #2d0d45;
                        box-shadow: 0 0 20px rgba(233, 0, 82, 0.6);
                        animation: glow-magenta 2s ease-in-out infinite;
                    }
                    
                    @keyframes glow-magenta {
                        0%, 100% { box-shadow: 0 0 20px rgba(233, 0, 82, 0.6); }
                        50% { box-shadow: 0 0 30px rgba(233, 0, 82, 0.8), 0 0 40px rgba(233, 0, 82, 0.4); }
                    }

                    .rank-europe {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        color: #000;
                        border-color: #ea580c;
                        box-shadow: 0 0 20px rgba(251, 146, 60, 0.6);
                        animation: glow-orange 2s ease-in-out infinite;
                    }

                    @keyframes glow-orange {
                        0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.6); }
                        50% { box-shadow: 0 0 30px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.4); }
                    }

                    .rank-danger {
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                        color: #fff;
                        border-color: #b91c1c;
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
                        animation: glow-red 2s ease-in-out infinite;
                    }

                    @keyframes glow-red {
                        0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); }
                        50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4); }
                    }

                    .col-team {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                    }

                    .team-badge {
                        width: 48px;             
                        height: 48px;            
                        background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1rem;
                        font-weight: 700;
                        border: 2px solid #e90052;
                        box-shadow: 0 4px 15px rgba(233, 0, 82, 0.25);
                        transition: all 0.3s ease;
                        position: relative;
                        flex-shrink: 0;          
                    }
                    
                    .team-badge::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: 8px;
                        padding: 2px;
                        background: linear-gradient(135deg, #e90052, #3d195b);
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor;
                        mask-composite: exclude;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    
                    .league-table-row:hover .team-badge {
                        transform: scale(1.15) rotate(5deg);
                        border-color: #3d195b;
                        box-shadow: 0 6px 25px rgba(233, 0, 82, 0.5);
                    }

                    .league-table-row:hover .team-badge::after {
                        opacity: 1;
                    }

                    .team-name-full {
                        font-weight: 500;
                    }

                    .col-stat {
                        text-align: center;
                        font-size: 0.9rem;
                    }

                    .stat-highlight {
                        background: linear-gradient(135deg, #ff1a75, #c026d3, #e879f9);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-weight: 600;
                    }

                    .stat-bold {
                        font-weight: 700;
                        font-size: 1rem;
                    }

                    .squad-expansion {
                        background: linear-gradient(180deg, #222, #1e1e1e);
                        border-top: 2px solid #e90052;
                        animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .squad-expansion::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(233, 0, 82, 0.1), transparent);
                        animation: shimmerExpansion 2s ease-in-out;
                    }

                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            max-height: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            max-height: 1000px;
                            transform: translateY(0);
                        }
                    }

                    @keyframes shimmerExpansion {
                        0% { left: -100%; }
                        100% { left: 100%; }
                    }

                    .squad-player-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1.25rem 1.5rem 1.25rem 3rem;
                        border-bottom: 2px solid #333;
                        font-size: 0.9rem;
                        transition: all 0.3s ease;
                        position: relative;
                        animation: fadeInPlayer 0.4s ease forwards;
                        opacity: 0;
                        margin-bottom: 0.5rem;
                        background: linear-gradient(90deg, rgba(42, 42, 42, 0.3), transparent);
                    }

                    @keyframes fadeInPlayer {
                        from {
                            opacity: 0;
                            transform: translateX(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    .squad-player-row:nth-child(1) { animation-delay: 0.05s; }
                    .squad-player-row:nth-child(2) { animation-delay: 0.1s; }
                    .squad-player-row:nth-child(3) { animation-delay: 0.15s; }
                    .squad-player-row:nth-child(4) { animation-delay: 0.2s; }
                    .squad-player-row:nth-child(5) { animation-delay: 0.25s; }
                    .squad-player-row:nth-child(n+6) { animation-delay: 0.3s; }

                    .squad-player-row::before {
                        content: '';
                        position: absolute;
                        left: 1.5rem;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 4px;
                        height: 0;
                        background: linear-gradient(180deg, #e90052, #3d195b);
                        border-radius: 2px;
                        transition: height 0.3s ease;
                    }
                    
                    .squad-player-row:hover {
                        background: linear-gradient(90deg, rgba(233, 0, 82, 0.1), transparent);
                        padding-left: 3.5rem;
                        border-left: 3px solid #e90052;
                    }

                    .squad-player-row:hover::before {
                        height: 60%;
                    }

                    .squad-player-row:last-child {
                        border-bottom: none;
                    }

                    .search-section {
                        margin-bottom: 1.5rem;
                    }

                    .search-input-box {
                        width: 100%;
                        background: #2a2a2a;
                        border: 1px solid #333;
                        border-radius: 8px;
                        padding: 0.85rem 1rem;
                        color: #fff;
                        font-size: 0.95rem;
                    }

                    .search-input-box::placeholder {
                        color: #666;
                    }

                    .search-input-box:focus {
                        outline: none;
                        border-color: #e90052;
                        box-shadow: 0 0 20px rgba(233, 0, 82, 0.3);
                    }

                    .data-table {
                        overflow: hidden;
                    }

                    .table-row {
                        border-bottom: 1px solid #333;
                        transition: background 0.2s;
                    }

                    .table-row:hover {
                        background: #333;
                    }

                    .table-row:last-child {
                        border-bottom: none;
                    }

                    .row-main {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.85rem 1.25rem;
                    }

                    .player-info-cell {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex: 1;
                    }

                    .player-avatar {
                        width: 48px;
                        height: 48px;
                        background: linear-gradient(135deg, #ff1a75, #c026d3);
                        color: #fff;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 0.95rem;
                        box-shadow: 0 0 20px rgba(255, 26, 117, 0.6);
                        transition: all 0.3s ease;
                        border: 2px solid #ff1a75;
                    }
                    
                    .table-row:hover .player-avatar {
                        transform: scale(1.1) rotate(5deg);
                        box-shadow: 0 0 20px rgba(233, 0, 82, 0.6);
                    }

                    .player-text {
                        flex: 1;
                    }

                    .player-name-text {
                        font-weight: 500;
                        margin-bottom: 0.2rem;
                    }

                    .player-meta-text {
                        font-size: 0.85rem;
                        color: #888;
                    }

                    .stats-cell {
                        display: flex;
                        gap: 1.5rem;
                        align-items: center;
                    }

                    .stat-group {
                        display: flex;
                        align-items: baseline;
                        gap: 0.3rem;
                    }

                    .stat-num {
                        font-weight: 600;
                        font-size: 0.95rem;
                        background: linear-gradient(135deg, #ff1a75, #c026d3);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .stat-lbl {
                        font-size: 0.75rem;
                        color: #888;
                    }

                    .prediction-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }

                    .generate-btn {
                        background: linear-gradient(135deg, #e90052, #3d195b);
                        color: #fff;
                        border: none;
                        padding: 0.85rem 2rem;
                        border-radius: 10px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 20px rgba(233, 0, 82, 0.3);
                        position: relative;
                        overflow: hidden;
                    }

                    .generate-btn::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width:
                        .generate-btn::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                        transition: left 0.5s;
                    }

                    .generate-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 30px rgba(233, 0, 82, 0.5);
                    }

                    .generate-btn:hover::before {
                        left: 100%;
                    }

                    .generate-btn:disabled {
                        background: #333;
                        color: #666;
                        cursor: not-allowed;
                        transform: none;
                    }

                    .prediction-footer {
                        padding: 1rem 1.25rem;
                        text-align: center;
                        font-size: 0.85rem;
                        color: #888;
                        border-top: 1px solid #333;
                    }

                    .loading-message,
                    .error-message {
                        text-align: center;
                        padding: 2rem;
                        font-size: 0.95rem;
                    }

                    .error-message {
                        color: #ef4444;
                    }
                    
                    .clickable-name {
                        cursor: pointer;
                        transition: color 0.2s;
                    }
                    
                    .clickable-name:hover {
                        color: #ff1a75;
                        text-decoration: underline;
                    }
                    
                    .player-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        animation: fadeIn 0.2s;
                    }
                    
                    .player-modal-content {
                        background: linear-gradient(135deg, #2a2a2a, #242424);
                        border: 2px solid #ff1a75;
                        border-radius: 16px;
                        padding: 2rem;
                        max-width: 500px;
                        width: 90%;
                        position: relative;
                        box-shadow: 0 10px 50px rgba(233, 0, 82, 0.3);
                    }
                    
                    .modal-close {
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: none;
                        border: none;
                        color: #fff;
                        font-size: 2rem;
                        cursor: pointer;
                        line-height: 1;
                    }
                    
                    .modal-close:hover {
                        color: #ff1a75;
                    }
                    
                    .player-modal-content h2 {
                        margin-bottom: 1rem;
                        font-size: 1.5rem;
                    }
                    
                    .player-details {
                        margin-bottom: 1.5rem;
                        color: #aaa;
                    }
                    
                    .player-details p {
                        margin: 0.5rem 0;
                    }
                    
                    .recommendation-box {
                        background: #1f1f1f;
                        border: 3px solid;
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin-top: 1rem;
                    }
                    
                    .recommendation-box h3 {
                        margin: 0 0 1rem 0;
                        font-size: 1.3rem;
                    }
                    
                    .recommendation-reasons {
                        list-style: none;
                        padding: 0;
                    }
                    
                    .recommendation-reasons li {
                        padding: 0.5rem 0;
                        padding-left: 1.5rem;
                        position: relative;
                    }
                    
                    .recommendation-reasons li::before {
                        content: '→';
                        position: absolute;
                        left: 0;
                        color: #ff1a75;
                    }
                    
                    

                    @media (max-width: 768px) {
                        .league-header {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 1rem;
                        }

                        .nav-content {
                            overflow-x: auto;
                        }

                        .stats-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }

                        .content-row {
                            grid-template-columns: 1fr;
                        }

                        .stats-cell {
                            gap: 0.75rem;
                        }

                        .stat-group {
                            flex-direction: column;
                            gap: 0;
                            text-align: center;
                        }

                        .league-table-header,
                        .league-table-row {
                            grid-template-columns: 40px 1fr 50px 50px 50px;
                            font-size: 0.85rem;
                        }

                        .team-badge {
                            width: 40px;
                            height: 40px;
                            font-size: 0.65rem;
                        }
                    }
                `}</style>
            </div>
        </Router>
    );
}

export default App;
