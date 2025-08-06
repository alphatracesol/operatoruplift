#!/usr/bin/env python3
"""
Careful View Structure Fix for Operator Uplift
Preserves main views and only removes duplicate sub-views
"""

import re
import os
from datetime import datetime

def careful_view_fix():
    """Carefully fix view structure without breaking main views"""
    
    print("🔧 CAREFUL VIEW STRUCTURE FIX")
    print("=" * 50)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # 1. First, verify main views exist
    print("\n1️⃣ VERIFYING MAIN VIEWS...")
    
    auth_view_match = re.search(r'<div[^>]*id="auth-view"[^>]*>', content)
    dashboard_view_match = re.search(r'<div[^>]*id="dashboard-view"[^>]*>', content)
    
    if auth_view_match:
        print("✅ auth-view found")
    else:
        print("❌ auth-view missing!")
        return False
    
    if dashboard_view_match:
        print("✅ dashboard-view found")
    else:
        print("❌ dashboard-view missing!")
        return False
    
    # 2. Find all view elements
    print("\n2️⃣ ANALYZING ALL VIEW ELEMENTS...")
    
    view_pattern = r'<div[^>]*class="[^"]*view[^"]*"[^>]*>'
    view_matches = list(re.finditer(view_pattern, content))
    
    print(f"Found {len(view_matches)} view elements:")
    
    view_elements = []
    for i, match in enumerate(view_matches):
        # Get the full div tag
        div_start = match.start()
        div_end = content.find('>', div_start) + 1
        div_tag = content[div_start:div_end]
        
        # Extract ID and class names
        id_match = re.search(r'id="([^"]*)"', div_tag)
        class_match = re.search(r'class="([^"]*)"', div_tag)
        
        view_id = id_match.group(1) if id_match else 'no-id'
        classes = class_match.group(1).split() if class_match else []
        view_classes = [cls for cls in classes if 'view' in cls]
        
        view_elements.append({
            'index': i,
            'tag': div_tag,
            'id': view_id,
            'classes': view_classes,
            'start': div_start,
            'end': div_end
        })
        print(f"  {i+1}. ID: {view_id}, Classes: {view_classes}")
    
    # 3. Identify legitimate vs duplicate views
    print("\n3️⃣ IDENTIFYING LEGITIMATE VS DUPLICATE VIEWS...")
    
    legitimate_main_views = ['auth-view', 'dashboard-view']
    legitimate_sub_views = ['goals-view', 'ai-chat-view', 'habits-view', 'focus-view', 'analytics-view', 'community-view', 'settings-view']
    all_legitimate_views = legitimate_main_views + legitimate_sub_views
    
    duplicate_views = []
    
    for view in view_elements:
        view_id = view['id']
        if view_id in legitimate_main_views:
            print(f"  ✅ Main view: {view_id}")
        elif view_id in legitimate_sub_views:
            print(f"  ✅ Sub view: {view_id}")
        else:
            duplicate_views.append(view)
            print(f"  ❌ Duplicate view: {view_id}")
    
    # 4. Fix duplicate views (only remove true duplicates)
    if duplicate_views:
        print(f"\n4️⃣ FIXING {len(duplicate_views)} DUPLICATE VIEWS...")
        
        # Sort by position (reverse order to maintain indices)
        duplicate_views.sort(key=lambda x: x['start'], reverse=True)
        
        for view in duplicate_views:
            print(f"  Removing duplicate view: {view['id']}")
            
            # Find the closing div for this view
            div_start = view['start']
            
            # Find the corresponding closing div
            pos = div_start
            open_count = 0
            close_count = 0
            closing_pos = -1
            
            while pos < len(content):
                if content[pos:pos+5] == '<div ':
                    open_count += 1
                elif content[pos:pos+6] == '</div>':
                    close_count += 1
                    if close_count > open_count:
                        closing_pos = pos
                        break
                pos += 1
            
            if closing_pos != -1:
                # Remove the entire view block
                content = content[:div_start] + content[closing_pos+6:]
                fixes_applied.append(f"Removed duplicate view: {view['id']}")
            else:
                print(f"  ⚠️  Could not find closing div for {view['id']}")
    
    # 5. Create backup and save fixed file
    print("\n💾 SAVING CAREFUL VIEW FIXES...")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"app-careful-view-fixes-backup-{timestamp}.html"
    
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"✅ Backup created: {backup_filename}")
    
    # Save fixed content
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Careful view structure fixed app.html saved")
    
    # 6. Verify the fixes
    print("\n🔍 VERIFYING CAREFUL VIEW FIXES...")
    
    # Check remaining view elements
    remaining_view_matches = list(re.finditer(view_pattern, content))
    print(f"Remaining view elements: {len(remaining_view_matches)}")
    
    # Verify main views still exist
    auth_view_still_exists = re.search(r'<div[^>]*id="auth-view"[^>]*>', content)
    dashboard_view_still_exists = re.search(r'<div[^>]*id="dashboard-view"[^>]*>', content)
    
    if auth_view_still_exists and dashboard_view_still_exists:
        print("✅ Main views (auth-view, dashboard-view) are preserved!")
    else:
        print("❌ Main views were accidentally removed!")
        return False
    
    if len(remaining_view_matches) <= 10:  # Allow for main views + sub views
        print("✅ View structure is now reasonable!")
    else:
        print("⚠️  Still have many view elements")
    
    # 7. Summary
    print("\n" + "=" * 50)
    print("📊 CAREFUL VIEW FIXES APPLIED")
    print("=" * 50)
    
    if fixes_applied:
        for i, fix in enumerate(fixes_applied, 1):
            print(f"{i}. {fix}")
        print(f"\n✅ Applied {len(fixes_applied)} careful view fixes")
    else:
        print("✅ No careful view fixes needed")
    
    return True

if __name__ == "__main__":
    careful_view_fix()
