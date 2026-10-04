import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessageItem({ message }) {
  const isBot = message.role === 'assistant';

  // Format simple markdown bold and bullet points
  const formatContent = (text) => {
    return text.split('\n').map((line, idx) => {
      // Bold replacement
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc"
            dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[•-]\s*/, '') }}
          />
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className={`flex gap-3 text-xs leading-relaxed ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
          isBot
            ? 'bg-bgCard border border-borderColor text-textPrimary rounded-tl-sm'
            : 'bg-accentTeal text-bgPrimary font-medium rounded-tr-sm shadow-md shadow-accentTeal/15'
        }`}
      >
        <div className="space-y-1">
          {formatContent(message.content)}
        </div>

        <div className="mt-2 text-right">
          <span className={`text-[10px] ${isBot ? 'text-textSecondary' : 'text-bgPrimary/70'}`}>
            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
          </span>
        </div>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-bgElevated border border-borderColor flex items-center justify-center text-textSecondary flex-shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
