'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ListTodo, Plus, Trash2, X, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useFullscreenInactivityStore } from '@/hooks/useFullscreenInactivity';
import { triggerFullPageConfetti } from '@/lib/confetti';
import { useCelebrationStore } from '@/store/useCelebrationStore';

export const TodoPill = () => {
  const {
    todos = [],
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
    showTodoPill,
    userName,
  } = usePreferencesStore();

  const { isFullscreen, isInactive } = useFullscreenInactivityStore();

  const [isOpen, setIsOpen] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!mounted) return null;
  if (!showTodoPill) return null;

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const uncompletedTodos = todos.filter((t) => !t.completed);
  const topTask = uncompletedTodos.length > 0 ? uncompletedTodos[0].text : null;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    addTodo(newTodoText.trim());
    setNewTodoText('');
  };

  const handleToggle = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (target && !target.completed) {
      const willBeAllCompleted = todos.filter((t) => t.id !== id).every((t) => t.completed);
      if (willBeAllCompleted && todos.length > 0) {
        triggerFullPageConfetti();
        const name = userName?.trim();
        useCelebrationStore.getState().showCelebration({
          icon: '✨',
          title: name ? `All tasks completed, ${name}!` : `All tasks completed!`,
          subtitle: `Every single session task is checked off. Superb productivity!`,
          type: 'todo',
        });
      }
    }
    toggleTodo(id);
  };

  return (
    <div
      ref={popoverRef}
      className={`relative select-none transition-opacity duration-700 ${
        isFullscreen && isInactive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="absolute bottom-full left-0 mb-2.5 w-[310px] p-4 rounded-3xl liquid-glass text-foreground shadow-2xl flex flex-col gap-3 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/10 pb-2.5">
              <div className="flex items-center gap-2">
                <ListTodo size={16} className="text-foreground/80" />
                <span className="text-sm font-bold tracking-tight">Session Tasks</span>
              </div>
              <div className="flex items-center gap-1.5">
                {completedCount > 0 && (
                  <button
                    onClick={clearCompletedTodos}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-foreground/[0.07] hover:bg-foreground/[0.14] text-foreground/70 hover:text-foreground transition-all cursor-pointer flex items-center gap-1"
                    aria-label="Clear completed tasks"
                  >
                    <CheckCheck size={11} />
                    <span>Clear Done</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Add Task Input Form */}
            <form onSubmit={handleAdd} className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a focus task..."
                className="flex-1 bg-foreground/[0.06] border border-foreground/10 focus:border-foreground/30 rounded-2xl px-3.5 py-2 text-xs text-foreground placeholder:text-foreground/35 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newTodoText.trim()}
                className="p-2 rounded-2xl bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 active:scale-95 transition-all cursor-pointer shrink-0"
                aria-label="Add task"
              >
                <Plus size={14} />
              </button>
            </form>

            {/* Tasks List */}
            <div className="flex flex-col gap-1.5 max-h-[190px] overflow-y-auto pr-0.5">
              {todos.length === 0 ? (
                <div className="py-5 text-center text-xs text-foreground/45 flex flex-col items-center gap-1">
                  <span>No tasks yet</span>
                  <span className="text-[10px] opacity-70">Add a task to stay focused</span>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      todo.completed
                        ? 'bg-foreground/[0.02] border-transparent opacity-60'
                        : 'bg-foreground/[0.05] border-foreground/10 hover:border-foreground/20'
                    }`}
                  >
                    {/* Checkbox + Label */}
                    <button
                      onClick={() => handleToggle(todo.id)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                          todo.completed
                            ? 'bg-white border-white text-black'
                            : 'border-foreground/30 hover:border-foreground/60'
                        }`}
                      >
                        {todo.completed && <Check size={10} strokeWidth={3.5} />}
                      </div>
                      <span
                        className={`text-xs truncate ${
                          todo.completed ? 'line-through opacity-60' : 'font-medium opacity-90'
                        }`}
                      >
                        {todo.text}
                      </span>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-red-400 text-foreground/40 transition-all cursor-pointer ml-1.5 shrink-0"
                      aria-label="Delete task"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Progress Bar */}
            {totalCount > 0 && (
              <div className="pt-2 border-t border-foreground/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-foreground/60">
                  <span>{completedCount} of {totalCount} completed</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-300 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Pill with Matching Liquid Glass Effect */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 liquid-glass text-foreground rounded-full p-1.5 px-3.5 shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      >
        <ListTodo size={14} className="text-foreground/75 shrink-0" />

        {/* Task summary label */}
        <span className="text-xs font-medium max-w-[220px] sm:max-w-[280px] truncate opacity-90">
          {totalCount === 0
            ? 'Add task'
            : topTask
            ? topTask
            : 'All tasks done! 🎉'}
        </span>

        {/* Counter Badge */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/[0.08] text-xs font-mono font-bold text-foreground shrink-0">
          <span>
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  );
};
