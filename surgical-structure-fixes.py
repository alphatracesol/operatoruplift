#!/usr/bin/env python3
"""
Surgical Structure Fixes for Operator Uplift
Carefully fixes remaining critical issues without breaking functionality
"""

import re
import os
from datetime import datetime

def surgical_fix_remaining_issues():
    """Surgically fix remaining critical issues without breaking functionality"""
    
    print("🔧 SURGICAL STRUCTURE FIXES")
    print("=" * 50)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # 1. Fix remaining duplicate IDs (3 critical ones)
    print("\n1️⃣ FIXING REMAINING DUPLICATE IDs...")
    
    # Fix total-achievements duplicates
    total_achievements_pattern = r'<span[^>]*id="total-achievements"[^>]*>'
    total_achievements_matches = list(re.finditer(total_achievements_pattern, content))
    
    if len(total_achievements_matches) > 1:
        for i, match in enumerate(total_achievements_matches[1:], 1):
            old_id = 'id="total-achievements"'
            new_id = f'id="total-achievements-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate total-achievements ID to total-achievements-{i}")
    
    # Fix total-goals duplicates
    total_goals_pattern = r'<span[^>]*id="total-goals"[^>]*>'
    total_goals_matches = list(re.finditer(total_goals_pattern, content))
    
    if len(total_goals_matches) > 1:
        for i, match in enumerate(total_goals_matches[1:], 1):
            old_id = 'id="total-goals"'
            new_id = f'id="total-goals-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate total-goals ID to total-goals-{i}")
    
    # Fix current-streak-social duplicates
    current_streak_pattern = r'<span[^>]*id="current-streak-social"[^>]*>'
    current_streak_matches = list(re.finditer(current_streak_pattern, content))
    
    if len(current_streak_matches) > 1:
        for i, match in enumerate(current_streak_matches[1:], 1):
            old_id = 'id="current-streak-social"'
            new_id = f'id="current-streak-social-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate current-streak-social ID to current-streak-social-{i}")
    
    # 2. Carefully remove duplicate functions (keep only the first instance)
    print("\n2️⃣ CAREFULLY REMOVING DUPLICATE FUNCTIONS...")
    
    # Remove duplicate actionHandler functions (keep first, remove others)
    action_handler_pattern = r'(actionHandler\s*:\s*function\s*\([^)]*\)\s*\{[^}]*\})'
    action_handler_matches = list(re.finditer(action_handler_pattern, content, re.DOTALL))
    
    if len(action_handler_matches) > 1:
        # Keep the first one, remove the rest
        for match in reversed(action_handler_matches[1:]):
            content = content[:match.start()] + content[match.end():]
            fixes_applied.append("Removed duplicate actionHandler function")
    
    # Remove duplicate secondaryActionHandler functions (keep first, remove others)
    secondary_handler_pattern = r'(secondaryActionHandler\s*:\s*function\s*\([^)]*\)\s*\{[^}]*\})'
    secondary_handler_matches = list(re.finditer(secondary_handler_pattern, content, re.DOTALL))
    
    if len(secondary_handler_matches) > 1:
        # Keep the first one, remove the rest
        for match in reversed(secondary_handler_matches[1:]):
            content = content[:match.start()] + content[match.end():]
            fixes_applied.append("Removed duplicate secondaryActionHandler function")
    
    # 3. Fix div structure (remove extra closing divs)
    print("\n3️⃣ FIXING DIV STRUCTURE...")
    
    # Count divs
    open_divs = content.count('<div')
    close_divs = content.count('</div>')
    
    if close_divs > open_divs:
        extra_closing = close_divs - open_divs
        print(f"Found {extra_closing} extra closing div tags")
        
        # Find and remove the last few closing divs that are likely extra
        # This is a conservative approach - only remove if we have clear extra closing tags
        if extra_closing <= 3:  # Only if we have 3 or fewer extra
            # Find the last few closing divs and remove them
            last_closing_divs = []
            pos = len(content)
            for i in range(extra_closing):
                pos = content.rfind('</div>', 0, pos)
                if pos != -1:
                    last_closing_divs.append(pos)
            
            # Remove them in reverse order to maintain positions
            for pos in sorted(last_closing_divs, reverse=True):
                content = content[:pos] + content[pos+6:]  # Remove '</div>'
                fixes_applied.append("Removed extra closing div tag")
    
    # 4. Create backup and save fixed file
    print("\n💾 SAVING SURGICAL FIXES...")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"app-surgical-fixes-backup-{timestamp}.html"
    
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"✅ Backup created: {backup_filename}")
    
    # Save fixed content
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Surgically fixed app.html saved")
    
    # 5. Summary
    print("\n" + "=" * 50)
    print("📊 SURGICAL FIXES APPLIED")
    print("=" * 50)
    
    if fixes_applied:
        for i, fix in enumerate(fixes_applied, 1):
            print(f"{i}. {fix}")
        print(f"\n✅ Applied {len(fixes_applied)} surgical fixes")
    else:
        print("✅ No surgical fixes needed")
    
    # 6. Verify the fixes
    print("\n🔍 VERIFYING FIXES...")
    
    # Check if we fixed the duplicate IDs
    remaining_duplicates = []
    id_pattern = r'id="([^"]+)"'
    all_ids = re.findall(id_pattern, content)
    id_counts = {}
    
    for id_name in all_ids:
        id_counts[id_name] = id_counts.get(id_name, 0) + 1
    
    duplicate_ids = {id_name: count for id_name, count in id_counts.items() if count > 1}
    
    if duplicate_ids:
        print("⚠️  Still have duplicate IDs:")
        for id_name, count in duplicate_ids.items():
            print(f"   - {id_name}: {count} instances")
            remaining_duplicates.append(f"{id_name}: {count} instances")
    else:
        print("✅ All duplicate IDs fixed!")
    
    # Check div structure
    new_open_divs = content.count('<div')
    new_close_divs = content.count('</div>')
    
    if new_open_divs == new_close_divs:
        print("✅ Div structure is now balanced!")
    else:
        print(f"⚠️  Div structure still unbalanced: {new_open_divs} open, {new_close_divs} close")
    
    return fixes_applied, remaining_duplicates

if __name__ == "__main__":
    surgical_fix_remaining_issues()
