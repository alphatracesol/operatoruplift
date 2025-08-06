#!/usr/bin/env python3
"""
Function Duplicate Fix for Operator Uplift
Carefully removes duplicate function definitions while preserving functionality
"""

import re
import os
from datetime import datetime

def fix_duplicate_functions():
    """Fix duplicate function definitions without breaking functionality"""
    
    print("🔧 FUNCTION DUPLICATE FIX")
    print("=" * 50)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # 1. Find and analyze actionHandler functions
    print("\n1️⃣ ANALYZING ACTIONHANDLER FUNCTIONS...")
    
    # More specific pattern to find actionHandler functions
    action_handler_pattern = r'actionHandler\s*:\s*function\s*\([^)]*\)\s*\{[^}]*\}'
    action_handler_matches = list(re.finditer(action_handler_pattern, content, re.DOTALL))
    
    print(f"Found {len(action_handler_matches)} actionHandler functions")
    
    if len(action_handler_matches) > 1:
        # Keep the first one, remove the rest
        print("Keeping first actionHandler, removing duplicates...")
        for i, match in enumerate(action_handler_matches[1:], 1):
            # Get the function content to see what we're removing
            function_content = content[match.start():match.end()]
            print(f"Removing actionHandler #{i+1} (length: {len(function_content)} chars)")
            
            content = content[:match.start()] + content[match.end():]
            fixes_applied.append(f"Removed duplicate actionHandler function #{i+1}")
    
    # 2. Find and analyze secondaryActionHandler functions
    print("\n2️⃣ ANALYZING SECONDARYACTIONHANDLER FUNCTIONS...")
    
    # More specific pattern to find secondaryActionHandler functions
    secondary_handler_pattern = r'secondaryActionHandler\s*:\s*function\s*\([^)]*\)\s*\{[^}]*\}'
    secondary_handler_matches = list(re.finditer(secondary_handler_pattern, content, re.DOTALL))
    
    print(f"Found {len(secondary_handler_matches)} secondaryActionHandler functions")
    
    if len(secondary_handler_matches) > 1:
        # Keep the first one, remove the rest
        print("Keeping first secondaryActionHandler, removing duplicates...")
        for i, match in enumerate(secondary_handler_matches[1:], 1):
            # Get the function content to see what we're removing
            function_content = content[match.start():match.end()]
            print(f"Removing secondaryActionHandler #{i+1} (length: {len(function_content)} chars)")
            
            content = content[:match.start()] + content[match.end():]
            fixes_applied.append(f"Removed duplicate secondaryActionHandler function #{i+1}")
    
    # 3. Create backup and save fixed file
    print("\n💾 SAVING FUNCTION FIXES...")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"app-function-fixes-backup-{timestamp}.html"
    
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"✅ Backup created: {backup_filename}")
    
    # Save fixed content
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Function-fixed app.html saved")
    
    # 4. Verify the fixes
    print("\n🔍 VERIFYING FUNCTION FIXES...")
    
    # Check remaining actionHandler functions
    remaining_action_handlers = list(re.finditer(action_handler_pattern, content, re.DOTALL))
    print(f"Remaining actionHandler functions: {len(remaining_action_handlers)}")
    
    # Check remaining secondaryActionHandler functions
    remaining_secondary_handlers = list(re.finditer(secondary_handler_pattern, content, re.DOTALL))
    print(f"Remaining secondaryActionHandler functions: {len(remaining_secondary_handlers)}")
    
    if len(remaining_action_handlers) == 1 and len(remaining_secondary_handlers) == 1:
        print("✅ Function duplicates successfully removed!")
    else:
        print("⚠️  Still have function duplicates")
    
    # 5. Summary
    print("\n" + "=" * 50)
    print("📊 FUNCTION FIXES APPLIED")
    print("=" * 50)
    
    if fixes_applied:
        for i, fix in enumerate(fixes_applied, 1):
            print(f"{i}. {fix}")
        print(f"\n✅ Applied {len(fixes_applied)} function fixes")
    else:
        print("✅ No function fixes needed")
    
    return fixes_applied

if __name__ == "__main__":
    fix_duplicate_functions()
