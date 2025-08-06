#!/usr/bin/env python3
"""
Critical Structure Fixes for Operator Uplift
Fixes the most critical issues identified in the comprehensive analysis
"""

import re
import os
from datetime import datetime

def fix_critical_issues():
    """Fix critical structural issues in app.html"""
    
    print("🔧 CRITICAL STRUCTURE FIXES")
    print("=" * 50)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # 1. Fix duplicate treasure-chest IDs
    print("\n1️⃣ FIXING DUPLICATE TREASURE-CHEST IDs...")
    
    # Find all treasure-chest elements
    treasure_pattern = r'<div class="treasure-chest" id="treasure-chest"[^>]*>'
    treasure_matches = list(re.finditer(treasure_pattern, content))
    
    if len(treasure_matches) > 1:
        # Keep the first one, change others to unique IDs
        for i, match in enumerate(treasure_matches[1:], 1):
            old_id = 'id="treasure-chest"'
            new_id = f'id="treasure-chest-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate treasure-chest ID to treasure-chest-{i}")
    
    # 2. Fix duplicate toggle switch IDs
    print("\n2️⃣ FIXING DUPLICATE TOGGLE SWITCH IDs...")
    
    # Fix daily-reminders-toggle duplicates
    daily_reminders_pattern = r'<div class="toggle-switch" id="daily-reminders-toggle"[^>]*>'
    daily_matches = list(re.finditer(daily_reminders_pattern, content))
    
    if len(daily_matches) > 1:
        for i, match in enumerate(daily_matches[1:], 1):
            old_id = 'id="daily-reminders-toggle"'
            new_id = f'id="daily-reminders-toggle-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate daily-reminders-toggle ID to daily-reminders-toggle-{i}")
    
    # Fix achievement-alerts-toggle duplicates
    achievement_pattern = r'<div class="toggle-switch" id="achievement-alerts-toggle"[^>]*>'
    achievement_matches = list(re.finditer(achievement_pattern, content))
    
    if len(achievement_matches) > 1:
        for i, match in enumerate(achievement_matches[1:], 1):
            old_id = 'id="achievement-alerts-toggle"'
            new_id = f'id="achievement-alerts-toggle-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate achievement-alerts-toggle ID to achievement-alerts-toggle-{i}")
    
    # 3. Fix duplicate skill-points IDs
    print("\n3️⃣ FIXING DUPLICATE SKILL-POINTS IDs...")
    
    skill_points_pattern = r'<div[^>]*id="skill-points"[^>]*>'
    skill_matches = list(re.finditer(skill_points_pattern, content))
    
    if len(skill_matches) > 1:
        for i, match in enumerate(skill_matches[1:], 1):
            old_id = 'id="skill-points"'
            new_id = f'id="skill-points-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate skill-points ID to skill-points-{i}")
    
    # 4. Fix duplicate treasure-timer IDs
    print("\n4️⃣ FIXING DUPLICATE TREASURE-TIMER IDs...")
    
    timer_pattern = r'<div[^>]*id="treasure-timer"[^>]*>'
    timer_matches = list(re.finditer(timer_pattern, content))
    
    if len(timer_matches) > 1:
        for i, match in enumerate(timer_matches[1:], 1):
            old_id = 'id="treasure-timer"'
            new_id = f'id="treasure-timer-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate treasure-timer ID to treasure-timer-{i}")
    
    # 5. Fix duplicate total-achievements IDs
    print("\n5️⃣ FIXING DUPLICATE TOTAL-ACHIEVEMENTS IDs...")
    
    total_achievements_pattern = r'<div[^>]*id="total-achievements"[^>]*>'
    total_achievements_matches = list(re.finditer(total_achievements_pattern, content))
    
    if len(total_achievements_matches) > 1:
        for i, match in enumerate(total_achievements_matches[1:], 1):
            old_id = 'id="total-achievements"'
            new_id = f'id="total-achievements-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate total-achievements ID to total-achievements-{i}")
    
    # 6. Fix duplicate total-goals IDs
    print("\n6️⃣ FIXING DUPLICATE TOTAL-GOALS IDs...")
    
    total_goals_pattern = r'<div[^>]*id="total-goals"[^>]*>'
    total_goals_matches = list(re.finditer(total_goals_pattern, content))
    
    if len(total_goals_matches) > 1:
        for i, match in enumerate(total_goals_matches[1:], 1):
            old_id = 'id="total-goals"'
            new_id = f'id="total-goals-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate total-goals ID to total-goals-{i}")
    
    # 7. Fix duplicate current-streak-social IDs
    print("\n7️⃣ FIXING DUPLICATE CURRENT-STREAK-SOCIAL IDs...")
    
    streak_pattern = r'<div[^>]*id="current-streak-social"[^>]*>'
    streak_matches = list(re.finditer(streak_pattern, content))
    
    if len(streak_matches) > 1:
        for i, match in enumerate(streak_matches[1:], 1):
            old_id = 'id="current-streak-social"'
            new_id = f'id="current-streak-social-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate current-streak-social ID to current-streak-social-{i}")
    
    # 8. Fix duplicate daily-goals-list IDs
    print("\n8️⃣ FIXING DUPLICATE DAILY-GOALS-LIST IDs...")
    
    daily_goals_pattern = r'<div[^>]*id="daily-goals-list"[^>]*>'
    daily_goals_matches = list(re.finditer(daily_goals_pattern, content))
    
    if len(daily_goals_matches) > 1:
        for i, match in enumerate(daily_goals_matches[1:], 1):
            old_id = 'id="daily-goals-list"'
            new_id = f'id="daily-goals-list-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate daily-goals-list ID to daily-goals-list-{i}")
    
    # 9. Fix duplicate achievements-list IDs
    print("\n9️⃣ FIXING DUPLICATE ACHIEVEMENTS-LIST IDs...")
    
    achievements_pattern = r'<div[^>]*id="achievements-list"[^>]*>'
    achievements_matches = list(re.finditer(achievements_pattern, content))
    
    if len(achievements_matches) > 1:
        for i, match in enumerate(achievements_matches[1:], 1):
            old_id = 'id="achievements-list"'
            new_id = f'id="achievements-list-{i}"'
            content = content[:match.start()] + content[match.start():match.end()].replace(old_id, new_id) + content[match.end():]
            fixes_applied.append(f"Fixed duplicate achievements-list ID to achievements-list-{i}")
    
    # 10. Remove duplicate secondaryActionHandler functions
    print("\n🔟 REMOVING DUPLICATE SECONDARYACTIONHANDLER FUNCTIONS...")
    
    # Find all secondaryActionHandler function definitions
    handler_pattern = r'secondaryActionHandler\s*:\s*function\s*\([^)]*\)\s*\{[^}]*\}'
    handler_matches = list(re.finditer(handler_pattern, content, re.DOTALL))
    
    if len(handler_matches) > 1:
        # Keep the first one, remove the rest
        for match in reversed(handler_matches[1:]):
            content = content[:match.start()] + content[match.end():]
            fixes_applied.append("Removed duplicate secondaryActionHandler function")
    
    # 11. Create backup and save fixed file
    print("\n💾 SAVING FIXES...")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"app-critical-fixes-backup-{timestamp}.html"
    
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"✅ Backup created: {backup_filename}")
    
    # Save fixed content
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Fixed app.html saved")
    
    # 12. Summary
    print("\n" + "=" * 50)
    print("📊 FIXES APPLIED")
    print("=" * 50)
    
    if fixes_applied:
        for i, fix in enumerate(fixes_applied, 1):
            print(f"{i}. {fix}")
        print(f"\n✅ Applied {len(fixes_applied)} critical fixes")
    else:
        print("✅ No critical fixes needed")
    
    return fixes_applied

if __name__ == "__main__":
    fix_critical_issues()
