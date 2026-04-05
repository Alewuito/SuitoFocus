import './CandleElement.css'

export default function CandleElement({ isRunning, isComplete }) {
  const state = isComplete ? 'complete' : isRunning ? 'running' : 'idle'

  return (
    <div className={`candle candle--${state}`}>
      {/* Glow behind flame */}
      <div className="candle__glow" />
      
      {/* Flame */}
      {!isComplete && (
        <div className="candle__flame-wrapper">
          <div className="candle__flame">
            <div className="candle__flame-inner" />
          </div>
          <div className="candle__flame-highlight" />
        </div>
      )}

      {/* Smoke (visible on complete) */}
      {isComplete && (
        <div className="candle__smoke">
          <div className="candle__smoke-particle candle__smoke-particle--1" />
          <div className="candle__smoke-particle candle__smoke-particle--2" />
          <div className="candle__smoke-particle candle__smoke-particle--3" />
        </div>
      )}

      {/* Wick */}
      <div className="candle__wick" />

      {/* Wax body */}
      <div className="candle__body">
        <div className="candle__wax-drip candle__wax-drip--1" />
        <div className="candle__wax-drip candle__wax-drip--2" />
        <div className="candle__shine" />
      </div>

      {/* Base plate */}
      <div className="candle__plate" />
    </div>
  )
}
