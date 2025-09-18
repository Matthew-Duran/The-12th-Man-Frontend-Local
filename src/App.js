//Key Imports
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Search Players -----------------------------------------------------------------------------------
function SearchPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://premier-league-api-6lv7.onrender.com/api/v1/player');
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch players. Make sure your Spring Boot API is running on port 1212.');
            console.error('Error fetching players:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlayers = players.filter(player =>
        player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputStyle = {
        padding: '1rem',
        borderRadius: '25px',
        border: '1px solid #333',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '1rem',
        width: '300px'
    };

    const cardStyle = {
        background: 'rgba(255,255,255,0.1)',
        margin: '1rem auto',
        padding: '1rem',
        borderRadius: '10px',
        maxWidth: '600px',
        border: '1px solid rgba(255,255,255,0.2)'
    };

    return (
        <div>
            <h2>Search Players</h2>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <input
                    type="text"
                    placeholder="Search players by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={inputStyle}
                />
            </div>

            {loading && <p>Loading players...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <p>Found {filteredPlayers.length} players</p>
                    {filteredPlayers.map((player, index) => (
                        <div key={`${player.name}-${index}`} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: '#00d4ff', margin: 0 }}>{player.name}</h3>
                                <span style={{
                                    background: '#00d4ff',
                                    color: '#000',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '15px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}>
                  {player.position}
                </span>
                            </div>

                            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                                <strong>{player.team_name}</strong> | {player.nation ? player.nation.split(' ')[1] || player.nation : ''}
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: '1rem',
                                margin: '1rem 0',
                                padding: '1rem',
                                background: 'rgba(0, 212, 255, 0.1)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>Goals</div>
                                    <div style={{ fontSize: '1.5rem' }}>{player.goals || 0}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>Assists</div>
                                    <div style={{ fontSize: '1.5rem' }}>{player.assists || 0}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>Minutes</div>
                                    <div style={{ fontSize: '1.2rem' }}>{player.minutes_played || 0}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>Starts</div>
                                    <div style={{ fontSize: '1.2rem' }}>{player.starts || 0}/{player.matches_played || 0}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#a0a0a0' }}>
                                <span>xG: {player.expected_goals || 0}</span>
                                <span>xA: {player.expected_assists || 0}</span>
                                <span>Cards: {player.yellow_cards || 0}Y / {player.red_cards || 0}R</span>
                            </div>

                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                background: player.minutes_played > 300 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                                borderRadius: '5px',
                                fontSize: '0.8rem',
                                textAlign: 'center'
                            }}>
                                {player.minutes_played > 300 ? '✓ Regular Starter' : '⚠ Rotation Risk'}
                            </div>
                        </div>
                    ))}
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
            const response = await axios.get('https://premier-league-api-6lv7.onrender.com/api/v1/player');
            const playerData = response.data;
            setPlayers(playerData);

            // Calculate interesting stats
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

    const heroStyle = {
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.05))',
        borderRadius: '15px',
        border: '1px solid rgba(0, 212, 255, 0.2)'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
    };

    const statCardStyle = {
        background: 'rgba(0, 212, 255, 0.05)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
    };

    const highlightCardStyle = {
        background: 'rgba(0, 212, 255, 0.08)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '2px solid rgba(0, 212, 255, 0.3)',
        margin: '1rem 0',
        textAlign: 'center'
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2>Loading Premier League Data...</h2>
                <p>Fetching the latest 2025-26 season statistics</p>
            </div>
        );
    }

    return (
        <div>
            <div style={heroStyle}>
                <h2 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#00d4ff' }}>
                    The 12th Man
                </h2>
                <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '0.5rem' }}>
                    Your Premier League Statistics Hub
                </p>
                <p style={{ fontSize: '1.1rem', color: '#888' }}>
                    2025-26 Season | Live FPL Insights
                </p>
            </div>

            <div style={statsGridStyle}>
                <div style={statCardStyle}>
                    <h3 style={{ color: '#00d4ff', fontSize: '2rem', margin: 0 }}>
                        {stats.totalPlayers || 0}
                    </h3>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>Players Tracked</p>
                </div>

                <div style={statCardStyle}>
                    <h3 style={{ color: '#00d4ff', fontSize: '2rem', margin: 0 }}>
                        {stats.teamCount || 0}
                    </h3>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>Premier League Teams</p>
                </div>

                <div style={statCardStyle}>
                    <h3 style={{ color: '#00d4ff', fontSize: '2rem', margin: 0, }}>
                        {stats.nationCount || 0}
                    </h3>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>Nations Represented</p>
                </div>

                <div style={statCardStyle}>
                    <h3 style={{ color: '#00d4ff', fontSize: '2rem', margin: 0 }}>
                        {stats.totalGoals || 0}
                    </h3>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>Total Goals Scored</p>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ textAlign: 'center', color: '#00d4ff', marginBottom: '1.5rem' }}>
                    Season Highlights
                </h3>

                {stats.topScorer && (
                    <div style={highlightCardStyle}>
                        <h4 style={{ color: '#00d4ff', margin: 0 }}>⚽ Top Goalscorer</h4>
                        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
                            <strong>{stats.topScorer.name}</strong> ({stats.topScorer.team_name})
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                            {stats.topScorer.goals} goals in {stats.topScorer.matches_played} matches
                        </p>
                    </div>
                )}

                {stats.topAssister && (
                    <div style={highlightCardStyle}>
                        <h4 style={{ color: '#00d4ff', margin: 0 }}>🎯 Top Assister</h4>
                        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
                            <strong>{stats.topAssister.name}</strong> ({stats.topAssister.team_name})
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                            {stats.topAssister.assists} assists this season
                        </p>
                    </div>
                )}

                {stats.workhorse && (
                    <div style={highlightCardStyle}>
                        <h4 style={{ color: '#00d4ff', margin: 0 }}>🔋 Most Minutes Played</h4>
                        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
                            <strong>{stats.workhorse.name}</strong> ({stats.workhorse.team_name})
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                            {stats.workhorse.minutes_played} minutes
                        </p>
                    </div>
                )}
            </div>

            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                padding: '2rem',
                background: 'rgba(0, 212, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 212, 255, 0.1)'
            }}>
                <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
                    Ready to dominate your Fantasy Premier League?
                </p>
                <p style={{ color: '#888' }}>
                    Explore player stats, team analysis, and discover hidden gems using the navigation above.
                </p>
            </div>
        </div>
    );
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
            const response = await axios.get('https://premier-league-api-6lv7.onrender.com/api/v1/player');
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch players.');
            console.error('Error fetching players:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group players by team
    const teamStats = players.reduce((acc, player) => {
        const team = player.team_name || 'Unknown';

        if (!acc[team]) {
            acc[team] = {
                players: [],
                totalGoals: 0,
                totalAssists: 0,
                totalMinutes: 0,
                count: 0,
                topScorer: null,
                topAssister: null
            };
        }

        acc[team].players.push(player);
        acc[team].totalGoals += player.goals || 0;
        acc[team].totalAssists += player.assists || 0;
        acc[team].totalMinutes += player.minutes_played || 0;
        acc[team].count += 1;

        // Track top scorer and assister
        if (!acc[team].topScorer || (player.goals || 0) > (acc[team].topScorer.goals || 0)) {
            acc[team].topScorer = player;
        }
        if (!acc[team].topAssister || (player.assists || 0) > (acc[team].topAssister.assists || 0)) {
            acc[team].topAssister = player;
        }

        return acc;
    }, {});

    // Sort teams by goals
    const sortedTeams = Object.entries(teamStats)
        .sort(([,a], [,b]) => b.totalGoals - a.totalGoals);

    const cardStyle = {
        background: 'rgba(0, 212, 255, 0.05)',
        margin: '1rem auto',
        padding: '1rem',
        borderRadius: '10px',
        maxWidth: '900px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const playerCardStyle = {
        background: 'rgba(0, 212, 255, 0.03)',
        margin: '0.5rem 0',
        padding: '0.8rem',
        borderRadius: '8px',
        border: '1px solid rgba(0, 212, 255, 0.1)'
    };

    return (
        <div>
            <h2>Premier League Teams</h2>
            <p>Team statistics and squad analysis for FPL planning</p>

            {loading && <p>Loading teams data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>
                            {sortedTeams.length} teams analyzed
                        </p>
                    </div>

                    {sortedTeams.map(([team, stats]) => (
                        <div
                            key={team}
                            style={{
                                ...cardStyle,
                                transform: selectedTeam === team ? 'scale(1.02)' : 'scale(1)',
                                borderColor: selectedTeam === team ? '#00d4ff' : 'rgba(0, 212, 255, 0.2)'
                            }}
                            onClick={() => setSelectedTeam(selectedTeam === team ? '' : team)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: '#00d4ff', margin: 0, fontSize: '1.5rem' }}>
                                        {team}
                                    </h3>
                                    <p style={{ margin: '0.5rem 0', color: '#666' }}>
                                        {stats.count} players in database
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {stats.totalGoals}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Team Goals</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {stats.totalAssists}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Team Assists</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {stats.topScorer?.name?.split(' ').slice(-1)[0] || 'N/A'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Top Scorer</div>
                                    </div>
                                </div>
                            </div>

                            {selectedTeam === team && (
                                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(0, 212, 255, 0.2)', paddingTop: '1rem' }}>
                                    <h4 style={{ color: '#00d4ff', marginBottom: '1rem' }}>{team} Squad:</h4>
                                    {stats.players
                                        .sort((a, b) => (b.goals || 0) - (a.goals || 0))
                                        .map((player, index) => (
                                            <div key={`${player.name}-${index}`} style={playerCardStyle}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <strong style={{ color: '#ffffff' }}>{player.name}</strong>
                                                        <span style={{ marginLeft: '1rem', color: '#666' }}>
                              {player.position} | {player.nation ? player.nation.split(' ')[1] || player.nation : ''}
                            </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                                                        <span>{player.goals || 0}G</span>
                                                        <span>{player.assists || 0}A</span>
                                                        <span>{player.minutes_played || 0}min</span>
                                                        <span>{player.starts || 0}/{player.matches_played || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
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
            const response = await axios.get('https://premier-league-api-6lv7.onrender.com/api/v1/player');
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch players.');
            console.error('Error fetching players:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group players by position
    const positionStats = players.reduce((acc, player) => {
        const position = player.position || 'Unknown';

        if (!acc[position]) {
            acc[position] = {
                players: [],
                totalGoals: 0,
                totalAssists: 0,
                totalMinutes: 0,
                count: 0,
                avgGoals: 0,
                avgAssists: 0
            };
        }

        acc[position].players.push(player);
        acc[position].totalGoals += player.goals || 0;
        acc[position].totalAssists += player.assists || 0;
        acc[position].totalMinutes += player.minutes_played || 0;
        acc[position].count += 1;

        return acc;
    }, {});

    // Calculate averages and sort positions
    const sortedPositions = Object.entries(positionStats)
        .map(([position, stats]) => ({
            position,
            ...stats,
            avgGoals: (stats.totalGoals / stats.count).toFixed(2),
            avgAssists: (stats.totalAssists / stats.count).toFixed(2)
        }))
        .sort((a, b) => b.count - a.count);

    const cardStyle = {
        background: 'rgba(0, 212, 255, 0.05)',
        margin: '1rem auto',
        padding: '1rem',
        borderRadius: '10px',
        maxWidth: '800px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const playerCardStyle = {
        background: 'rgba(0, 212, 255, 0.03)',
        margin: '0.5rem 0',
        padding: '0.8rem',
        borderRadius: '8px',
        border: '1px solid rgba(0, 212, 255, 0.1)'
    };

    return (
        <div>
            <h2>Player Positions</h2>
            <p>Premier League players grouped by position</p>

            {loading && <p>Loading positions data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>
                            {sortedPositions.length} positions with {players.length} total players
                        </p>
                    </div>

                    {sortedPositions.map((posData) => (
                        <div
                            key={posData.position}
                            style={{
                                ...cardStyle,
                                transform: selectedPosition === posData.position ? 'scale(1.02)' : 'scale(1)',
                                borderColor: selectedPosition === posData.position ? '#00d4ff' : 'rgba(0, 212, 255, 0.2)'
                            }}
                            onClick={() => setSelectedPosition(selectedPosition === posData.position ? '' : posData.position)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: '#00d4ff', margin: 0, fontSize: '1.5rem' }}>
                                        {posData.position}
                                    </h3>
                                    <p style={{ margin: '0.5rem 0', color: '#666' }}>
                                        {posData.count} players
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {posData.avgGoals}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg Goals</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {posData.avgAssists}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg Assists</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {posData.totalGoals}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Goals</div>
                                    </div>
                                </div>
                            </div>

                            {selectedPosition === posData.position && (
                                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(0, 212, 255, 0.2)', paddingTop: '1rem' }}>
                                    <h4 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Top {posData.position} players:</h4>
                                    {posData.players
                                        .sort((a, b) => (b.goals || 0) - (a.goals || 0))
                                        .slice(0, 10)
                                        .map((player, index) => (
                                            <div key={`${player.name}-${index}`} style={playerCardStyle}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <strong style={{ color: '#ffffff' }}>{player.name}</strong>
                                                        <span style={{ marginLeft: '1rem', color: '#666' }}>
                              {player.team_name}
                            </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                                                        <span>{player.goals || 0}G</span>
                                                        <span>{player.assists || 0}A</span>
                                                        <span>{player.minutes_played || 0}min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
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
            const response = await axios.get('https://premier-league-api-6lv7.onrender.com/api/v1/player');            setPlayers(response.data);
            console.log('Nations data loaded:', response.data.length, 'players');
            setError(null);
        } catch (err) {
            setError('Failed to fetch players.');
            console.error('Error fetching players:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group players by nation
    const nationStats = players.reduce((acc, player) => {
        const nation = player.nation ? player.nation.split(' ')[1] || player.nation : 'Unknown';

        if (!acc[nation]) {
            acc[nation] = {
                players: [],
                totalGoals: 0,
                totalAssists: 0,
                totalMinutes: 0,
                count: 0
            };
        }

        acc[nation].players.push(player);
        acc[nation].totalGoals += player.goals || 0;
        acc[nation].totalAssists += player.assists || 0;
        acc[nation].totalMinutes += player.minutes_played || 0;
        acc[nation].count += 1;

        return acc;
    }, {});

    const sortedNations = Object.entries(nationStats)
        .sort(([,a], [,b]) => b.count - a.count);

    const cardStyle = {
        background: 'rgba(0, 212, 255, 0.05)',
        margin: '1rem auto',
        padding: '1rem',
        borderRadius: '10px',
        maxWidth: '800px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const playerCardStyle = {
        background: 'rgba(0, 212, 255, 0.03)',
        margin: '0.5rem 0',
        padding: '0.8rem',
        borderRadius: '8px',
        border: '1px solid rgba(0, 212, 255, 0.1)'
    };

    return (
        <div>
            <h2>Player Nations</h2>
            <p>Premier League players grouped by nationality</p>

            {loading && <p>Loading nations data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>
                            {sortedNations.length} nations represented with {players.length} total players
                        </p>
                    </div>

                    {sortedNations.map(([nation, stats]) => (
                        <div
                            key={nation}
                            style={{
                                ...cardStyle,
                                transform: selectedNation === nation ? 'scale(1.02)' : 'scale(1)',
                                borderColor: selectedNation === nation ? '#00d4ff' : 'rgba(0, 212, 255, 0.2)'
                            }}
                            onClick={() => setSelectedNation(selectedNation === nation ? '' : nation)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: '#00d4ff', margin: 0, fontSize: '1.5rem' }}>
                                        {nation}
                                    </h3>
                                    <p style={{ margin: '0.5rem 0', color: '#666' }}>
                                        {stats.count} players
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {stats.totalGoals}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Goals</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {stats.totalAssists}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Assists</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                            {Math.round(stats.totalMinutes / stats.count)}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg Mins</div>
                                    </div>
                                </div>
                            </div>

                            {selectedNation === nation && (
                                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(0, 212, 255, 0.2)', paddingTop: '1rem' }}>
                                    <h4 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Players from {nation}:</h4>
                                    {stats.players
                                        .sort((a, b) => (b.goals || 0) - (a.goals || 0))
                                        .map((player, index) => (
                                            <div key={`${player.name}-${index}`} style={playerCardStyle}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <strong style={{ color: '#ffffff' }}>{player.name}</strong>
                                                        <span style={{ marginLeft: '1rem', color: '#666' }}>
                              {player.team_name} - {player.position}
                            </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                                                        <span>{player.goals || 0}G</span>
                                                        <span>{player.assists || 0}A</span>
                                                        <span>{player.minutes_played || 0}min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
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
            const response = await axios.get('https://premier-league-api-6lv7.onrender.com/api/v1/player');
            setPredictions(response.data);
        } catch (err) {
            setError('Failed to load predictions. Please try again.');
            console.error('Error fetching predictions:', err);
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        background: 'rgba(0, 212, 255, 0.05)',
        margin: '0.5rem auto',
        padding: '1rem',
        borderRadius: '10px',
        maxWidth: '600px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const buttonStyle = {
        background: '#00d4ff',
        color: '#000',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '25px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '2rem'
    };

    return (
        <div>
            <h2>2025-26 Season Predictor</h2>
            <p>AI-powered predictions based on historical Premier League data</p>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <button
                    style={buttonStyle}
                    onClick={fetchPredictions}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Generate Table'}
                </button>
            </div>

            {error && (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            )}

            {predictions.length > 0 && (
                <div>
                    <h3 style={{ color: '#00d4ff', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Predicted 2025-26 Premier League Table
                    </h3>

                    {predictions.map((prediction) => (
                        <div key={prediction.id} style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    background: prediction.predictedRank <= 4 ? '#00d4ff' :
                                        prediction.predictedRank <= 6 ? '#ffa500' :
                                            prediction.predictedRank >= 18 ? '#ff4444' : '#666',
                                    color: '#fff',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {prediction.predictedRank}
                                </div>
                                <div>
                                    <strong style={{ fontSize: '1.1rem' }}>{prediction.teamName}</strong>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                                    {Math.round(prediction.predictedPoints)} pts
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    {prediction.predictedPoints.toFixed(1)} predicted
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '2rem', padding: '1rem', textAlign: 'center',
                        background: 'rgba(0, 212, 255, 0.03)', borderRadius: '10px' }}>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                            Predictions based on RandomForest model trained on 2020-2024 Premier League data
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// APP -----------------------------------------------------------------------------------
function App() {
    return (
        <Router>
            <div className="App">
                <header>
                    <h1>🏆 Premier League Dashboard</h1>

                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/teams">Teams</Link>
                        <Link to="/positions">Positions</Link>
                        <Link to="/nations">Nations</Link>
                        <Link to="/search">Search Players</Link>
                        <Link to="/prediction">League Prediction</Link>
                    </nav>
                </header>

                <main>
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/positions" element={<Positions />} />
                        <Route path="/nations" element={<Nations />} />
                        <Route path="/search" element={<SearchPlayers />} />
                        <Route path="/prediction" element={<Prediction />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;