import React from 'react';
import { KnowledgeNode } from '../types/learnmap';
import { Sparkles, AlertTriangle, CheckCircle2, Lock, Cloud, Zap, Flashlight } from 'lucide-react';

interface KnowledgeUniverseGraphProps {
  nodes: KnowledgeNode[];
  selectedNodeId: string;
  onSelectNode: (node: KnowledgeNode) => void;
  isFlashlightActive: boolean;
  onToggleFlashlight: () => void;
}

export const KnowledgeUniverseGraph: React.FC<KnowledgeUniverseGraphProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  isFlashlightActive,
  onToggleFlashlight,
}) => {
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[3];

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 border border-indigo-900/40 p-4 sm:p-6 overflow-hidden shadow-2xl">
      {/* Cosmic background stars and nebulae */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-2/3 w-48 h-48 bg-cyan-600/15 rounded-full blur-2xl" />
      </div>

      {/* Header controls & legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-100 tracking-wide">
              Vũ trụ Tri thức GDPT 2018 (Knowledge Graph)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Khám phá mạng lưới các nút tri thức và liên kết di truyền đa tầng
          </p>
        </div>

        {/* Action button: Đèn pin AI */}
        <button
          onClick={onToggleFlashlight}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isFlashlightActive
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-300'
              : 'bg-slate-800/90 text-amber-300 border border-amber-500/40 hover:bg-slate-700/80'
          }`}
        >
          <Flashlight className={`w-3.5 h-3.5 ${isFlashlightActive ? 'animate-bounce' : ''}`} />
          <span>{isFlashlightActive ? 'Đèn pin AI: ĐANG BẬT' : 'Bật Đèn pin AI'}</span>
        </button>
      </div>

      {/* Constellation SVG Canvas */}
      <div className="relative w-full overflow-x-auto min-h-[360px] flex items-center justify-center">
        <div className="relative w-[960px] h-[380px]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw connections */}
            {nodes.map((node) => {
              return node.ancestors.map((ancestorId) => {
                const ancestor = nodes.find((n) => n.id === ancestorId);
                if (!ancestor) return null;
                const isHighlighted =
                  isFlashlightActive ||
                  selectedNodeId === node.id ||
                  selectedNodeId === ancestor.id;

                return (
                  <g key={`${ancestor.id}-${node.id}`}>
                    <line
                      x1={ancestor.x}
                      y1={ancestor.y}
                      x2={node.x}
                      y2={node.y}
                      stroke={
                        isHighlighted
                          ? 'rgba(234, 179, 8, 0.8)'
                          : 'rgba(99, 102, 241, 0.3)'
                      }
                      strokeWidth={isHighlighted ? '2.5' : '1.5'}
                      strokeDasharray={isHighlighted ? '4 2' : 'none'}
                      className={isHighlighted ? 'animate-pulse' : ''}
                    />
                    {isHighlighted && (
                      <circle
                        r="3"
                        fill="#facc15"
                        className="animate-ping"
                        cx={(ancestor.x + node.x) / 2}
                        cy={(ancestor.y + node.y) / 2}
                      />
                    )}
                  </g>
                );
              });
            })}

            {/* Flashlight beam if active */}
            {isFlashlightActive && (
              <path
                d="M 640 160 L 400 380 L 100 380 Z"
                fill="url(#flashlight-beam)"
                opacity="0.25"
              />
            )}

            <defs>
              <linearGradient id="flashlight-beam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Interactive Node Elements */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            let statusColor = 'border-slate-700 bg-slate-900/90 text-slate-300';
            let statusBadge = null;

            if (node.status === 'mastered') {
              statusColor =
                'border-amber-400/80 bg-amber-950/70 text-amber-200 shadow-lg shadow-amber-500/20';
              statusBadge = <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />;
            } else if (node.status === 'current_challenge') {
              statusColor =
                'border-cyan-400 bg-cyan-950/80 text-cyan-200 ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/30 animate-pulse';
              statusBadge = <Zap className="w-3.5 h-3.5 text-cyan-400" />;
            } else if (node.status === 'gap_alert') {
              statusColor =
                'border-rose-500 bg-rose-950/80 text-rose-200 shadow-lg shadow-rose-500/30';
              statusBadge = <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
            } else if (node.status === 'fog') {
              statusColor = isFlashlightActive
                ? 'border-yellow-400 bg-slate-900/90 text-yellow-200 shadow-md shadow-yellow-400/30'
                : 'border-indigo-900/40 bg-slate-950/80 text-slate-500 opacity-60';
              statusBadge = <Cloud className="w-3.5 h-3.5 text-slate-400" />;
            } else if (node.status === 'locked') {
              statusColor = 'border-slate-800 bg-slate-950/80 text-slate-600 opacity-50';
              statusBadge = <Lock className="w-3.5 h-3.5 text-slate-500" />;
            }

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all duration-200 z-20 group ${
                  isSelected ? 'scale-110 ring-4 ring-indigo-400' : 'hover:scale-105'
                }`}
              >
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md ${statusColor}`}
                >
                  {statusBadge}
                  <div className="text-left">
                    <div className="text-xs font-bold whitespace-nowrap leading-tight">
                      {node.label}
                    </div>
                    <div className="text-[10px] opacity-75 font-mono">
                      Lớp {node.grade} • {node.domain}
                    </div>
                  </div>
                </div>

                {/* Hover Quick Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-[11px] text-slate-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-30">
                  <div className="font-semibold text-indigo-300">{node.code}</div>
                  <div className="mt-1 text-slate-300">{node.description}</div>
                  {node.misconceptionAlert && (
                    <div className="mt-1 text-rose-300 text-[10px] flex items-center gap-1 font-medium">
                      ⚠️ {node.misconceptionAlert}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Legends */}
      <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
            <span>Đã làm chủ (Mastered)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-medium">Thử thách hiện tại (Target)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-300">Cảnh báo Lỗ hổng Tri thức (Gap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-900 border border-slate-600" />
            <span>Vùng sương mù (Fog of War)</span>
          </div>
        </div>

        {selectedNode && (
          <div className="text-right text-[11px] text-indigo-300 font-mono">
            Đang chọn: <span className="font-bold text-white">{selectedNode.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};
