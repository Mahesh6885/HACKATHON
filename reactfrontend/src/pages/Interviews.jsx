import { useState, useEffect, useRef } from 'react';
import { User, MessageSquare, Send, PlayCircle, Loader2, RefreshCw, Mic, MicOff, AlertCircle } from 'lucide-react';
import './Interviews.css';

export default function Interviews() {
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answerInput, setAnswerInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [roleTarget, setRoleTarget] = useState('Software Engineer');

    const [isRecording, setIsRecording] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        fetch('http://localhost:8000/api/interview/history/', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => res.json())
            .then(data => {
                if (data.history) {
                    const mappedHistory = data.history.map(item => ({
                        id: item.id,
                        type: `AI Mock - ${item.role_target}`,
                        interviewer: 'AI Interview Engine',
                        date: item.session_date,
                        tech: item.score,
                        comm: item.score,
                        conf: item.score,
                        feedback: item.feedback
                    }));
                    setHistory(mappedHistory);
                }
                setIsLoadingHistory(false);
            })
            .catch(err => {
                console.error("Failed to fetch interview history", err);
                setIsLoadingHistory(false);
            });
    }, []);

    const startInterview = async () => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch('http://localhost:8000/api/interview/start/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ role_target: roleTarget })
            });
            const data = await res.json();
            setCurrentQuestion(data.question);
            setIsInterviewActive(true);
        } catch (error) {
            console.error("Failed to start interview", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const submitAnswer = async () => {
        if (!answerInput.trim()) return;
        setIsProcessing(true);

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch('http://localhost:8000/api/interview/evaluate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    role_target: roleTarget,
                    previous_question: currentQuestion,
                    answer: answerInput
                })
            });
            const data = await res.json();

            // Log it to history
            const scoreVal = typeof data.score === 'object'
                ? (data.score.technical || data.score.overall || data.score.communication || 0)
                : (typeof data.score === 'number' ? Math.round(data.score * 10) : 0);
            const feedbackVal = typeof data.feedback === 'string'
                ? data.feedback
                : (data.feedback ? JSON.stringify(data.feedback) : 'No feedback provided.');

            const newLog = {
                id: Date.now(),
                type: `AI Mock - ${roleTarget}`,
                interviewer: 'AI Interview Engine',
                date: new Date().toLocaleDateString(),
                tech: scoreVal,
                feedback: feedbackVal,
            };
            setHistory([newLog, ...history]);

            // Next question
            setCurrentQuestion(data.next_question);
            setAnswerInput('');

        } catch (error) {
            console.error("Failed to evaluate answer", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechError('Speech recognition is not supported in this browser. Use Chrome.');
            return;
        }

        if (isRecording) {
            // Stop
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
            return;
        }

        setSpeechError('');
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-IN';  // Indian English accent
        recognition.interimResults = true;  // Show partial results live
        recognition.continuous = true;      // Keep listening until stopped
        recognition.maxAlternatives = 1;

        let finalTranscript = '';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript = transcript;
                }
            }
            // Show final + interim combined in textarea so user sees live progress
            setAnswerInput(finalTranscript + interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setSpeechError('Microphone permission denied. Please allow microphone access in browser settings.');
            } else if (event.error === 'no-speech') {
                setSpeechError('No speech detected. Please speak clearly and try again.');
            } else {
                setSpeechError(`Speech error: ${event.error}`);
            }
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
        setIsRecording(true);
    };

    const endInterview = () => {
        setIsInterviewActive(false);
        setCurrentQuestion(null);
        setAnswerInput('');
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Mock Interviews</h1>
                    <p className="page-subtitle">Practice with our AI interviewer and get real-time feedback.</p>
                </div>
                {!isInterviewActive && (
                    <button className="btn-primary" onClick={startInterview} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                        {isProcessing ? "Starting..." : "Start AI Mock"}
                    </button>
                )}
                {isInterviewActive && (
                    <button className="btn-secondary" onClick={endInterview}>End Session</button>
                )}
            </div>

            <div className="interviews-container">

                {/* AI Interview Interface Section */}
                <div className="feedback-form-section animate-fade-in" style={{ backgroundColor: isInterviewActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)', border: isInterviewActive ? '1px solid var(--primary-light)' : '' }}>
                    <div className="form-header">
                        <h2 className="form-title">{isInterviewActive ? "Active Session" : "Interview Setup"}</h2>
                    </div>

                    {!isInterviewActive ? (
                        <>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Target Role</label>
                                <input
                                    type="text"
                                    value={roleTarget}
                                    onChange={(e) => setRoleTarget(e.target.value)}
                                    placeholder="e.g. Software Engineer, Data Scientist"
                                />
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                                <MessageSquare size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                                Configure your target role above, then click 'Start AI Mock' to begin an interactive session. The AI will ask you questions and evaluate your responses in real time.
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AI Interviewer</div>
                                <div style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>
                                    {currentQuestion || "Thinking..."}
                                </div>
                            </div>

                            <div className="form-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Your Answer</label>
                                <textarea
                                    className="note-input"
                                    placeholder={isRecording ? "Listening... Speak now." : "Type your response here or use voice..."}
                                    value={answerInput}
                                    onChange={(e) => setAnswerInput(e.target.value)}
                                    style={{ flexGrow: 1, minHeight: '150px', backgroundColor: isRecording ? '#fef2f2' : undefined }}
                                    disabled={isProcessing || isRecording}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button className="btn-primary" onClick={submitAnswer} disabled={isProcessing || isRecording || !answerInput.trim()}>
                                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    {isProcessing ? "Evaluating..." : "Submit Answer"}
                                </button>

                                <button
                                    className="btn-secondary"
                                    onClick={toggleRecording}
                                    disabled={isProcessing}
                                    style={{
                                        backgroundColor: isRecording ? '#fee2e2' : undefined,
                                        color: isRecording ? '#dc2626' : undefined,
                                        borderColor: isRecording ? '#fca5a5' : undefined
                                    }}
                                >
                                    {isRecording ? <MicOff className="animate-pulse" size={18} /> : <Mic size={18} />}
                                    {isRecording ? 'Stop Recording' : 'Use Voice'}
                                </button>

                                {isRecording && <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#dc2626', gap: '0.3rem' }}><Mic size={14} className="animate-pulse" /> Listening...</span>}
                                {speechError && <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#dc2626', gap: '0.3rem' }}><AlertCircle size={14} /> {speechError}</span>}
                            </div>
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div className="history-section">
                    {isLoadingHistory ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                            Loading previous sessions...
                        </div>
                    ) : history.length > 0 ? (
                        history.map((item, index) => (
                            <div key={item.id} className="interview-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="card-top">
                                    <div>
                                        <h3 className="company-title">{item.type}</h3>
                                        <div className="interviewer-name">
                                            <User size={14} /> {item.interviewer}
                                        </div>
                                    </div>
                                    <div className="date-badge">{item.date}</div>
                                </div>

                                <div className="scores-row">
                                    <div className="score-pill">
                                        <span className="pill-value">{item.tech}/100</span>
                                        <span className="pill-label">Overall Score</span>
                                    </div>
                                </div>

                                <div className="feedback-box">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                                        <MessageSquare size={14} /> Key Takeaways
                                    </div>
                                    <p className="feedback-text">"{item.feedback}"</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <MessageSquare size={32} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Interviews Yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Start your first AI Mock session above to receive personalized feedback!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
