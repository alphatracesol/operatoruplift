#!/usr/bin/env python3
"""
View Structure Fix for Operator Uplift
Identifies and fixes view structure issues
"""

import re
import os
from datetime import datetime

def fix_view_structure():
    """Fix view structure issues"""
    
    print("🔧 VIEW STRUCTURE FIX")
    print("=" * 50)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # 1. Find all view elements
    print("\n1️⃣ ANALYZING VIEW ELEMENTS...")
    
    # Pattern to find view elements
    view_pattern = r'<div[^>]*class="[^"]*view[^"]*"[^>]*>'
    view_matches = list(re.finditer(view_pattern, content))
    
    print(f"Found {len(view_matches)} view elements:")
    
    view_elements = []
    for i, match in enumerate(view_matches):
        # Get the full div tag
        div_start = match.start()
        div_end = content.find('>', div_start) + 1
        div_tag = content[div_start:div_end]
        
        # Extract class names
        class_match = re.search(r'class="([^"]*)"', div_tag)
        if class_match:
            classes = class_match.group(1).split()
            view_classes = [cls for cls in classes if 'view' in cls]
            view_elements.append({
                'index': i,
                'tag': div_tag,
                'classes': view_classes,
                'start': div_start,
                'end': div_end
            })
            print(f"  {i+1}. {view_classes}")
    
    # 2. Identify legitimate vs duplicate views
    print("\n2️⃣ IDENTIFYING LEGITIMATE VIEWS...")
    
    legitimate_views = ['auth-view', 'dashboard-view']
    duplicate_views = []
    
    for view in view_elements:
        view_name = view['classes'][0] if view['classes'] else 'unknown'
        if view_name not in legitimate_views:
            duplicate_views.append(view)
            print(f"  ❌ Duplicate view: {view_name}")
        else:
            print(f"  ✅ Legitimate view: {view_name}")
    
    # 3. Fix duplicate views
    if duplicate_views:
        print(f"\n3️⃣ FIXING {len(duplicate_views)} DUPLICATE VIEWS...")
        
        # Sort by position (reverse order to maintain indices)
        duplicate_views.sort(key=lambda x: x['start'], reverse=True)
        
        for view in duplicate_views:
            print(f"  Removing duplicate view: {view['classes']}")
            
            # Find the closing div for this view
            # This is a simplified approach - we'll remove the entire div block
            div_start = view['start']
            
            # Find the corresponding closing div
            # Count opening and closing divs to find the right closing tag
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
                fixes_applied.append(f"Removed duplicate view: {view['classes']}")
            else:
                print(f"  ⚠️  Could not find closing div for {view['classes']}")
    
    # 4. Create backup and save fixed file
    print("\n💾 SAVING VIEW STRUCTURE FIXES...")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"app-view-fixes-backup-{timestamp}.html"
    
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"✅ Backup created: {backup_filename}")
    
    # Save fixed content
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ View structure fixed app.html saved")
    
    # 5. Verify the fixes
    print("\n🔍 VERIFYING VIEW STRUCTURE FIXES...")
    
    # Check remaining view elements
    remaining_view_matches = list(re.finditer(view_pattern, content))
    print(f"Remaining view elements: {len(remaining_view_matches)}")
    
    for i, match in enumerate(remaining_view_matches):
        div_start = match.start()
        div_end = content.find('>', div_start) + 1
        div_tag = content[div_start:div_end]
        
        class_match = re.search(r'class="([^"]*)"', div_tag)
        if class_match:
            classes = class_match.group(1).split()
            view_classes = [cls for cls in classes if 'view' in cls]
            print(f"  {i+1}. {view_classes}")
    
    if len(remaining_view_matches) <= 2:
        print("✅ View structure is now clean!")
    else:
        print("⚠️  Still have too many view elements")
    
    # 6. Summary
    print("\n" + "=" * 50)
    print("📊 VIEW STRUCTURE FIXES APPLIED")
    print("=" * 50)
    
    if fixes_applied:
        for i, fix in enumerate(fixes_applied, 1):
            print(f"{i}. {fix}")
        print(f"\n✅ Applied {len(fixes_applied)} view structure fixes")
    else:
        print("✅ No view structure fixes needed")
    
    return fixes_applied

if __name__ == "__main__":
    fix_view_structure()
