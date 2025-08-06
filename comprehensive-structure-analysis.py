#!/usr/bin/env python3
"""
Comprehensive Structure Analysis for Operator Uplift
Identifies cross-app wrapper, structure, labeling, duplication, overlay, conflicting, z-layer, and logical errors
"""

import re
import os
from collections import defaultdict

def analyze_app_structure():
    """Analyze the current app.html for structural issues"""
    
    print("🔍 COMPREHENSIVE STRUCTURE ANALYSIS")
    print("=" * 60)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = {
        'duplicate_ids': [],
        'duplicate_classes': [],
        'duplicate_functions': [],
        'z_layer_conflicts': [],
        'structural_issues': [],
        'logical_errors': [],
        'overlay_conflicts': [],
        'cross_wrapper_issues': []
    }
    
    # 1. Check for duplicate IDs (critical issue)
    print("\n1️⃣ CHECKING FOR DUPLICATE IDs...")
    id_pattern = r'id="([^"]+)"'
    all_ids = re.findall(id_pattern, content)
    id_counts = defaultdict(int)
    
    for id_name in all_ids:
        id_counts[id_name] += 1
    
    duplicate_ids = {id_name: count for id_name, count in id_counts.items() if count > 1}
    
    if duplicate_ids:
        print("❌ CRITICAL: Duplicate IDs found:")
        for id_name, count in duplicate_ids.items():
            print(f"   - {id_name}: {count} instances")
            issues['duplicate_ids'].append(f"{id_name}: {count} instances")
    else:
        print("✅ No duplicate IDs found")
    
    # 2. Check for duplicate function definitions (excluding object properties)
    print("\n2️⃣ CHECKING FOR DUPLICATE FUNCTIONS...")
    function_patterns = [
        r'function\s+(\w+)\s*\(',
        r'const\s+(\w+)\s*=\s*function',
        r'let\s+(\w+)\s*=\s*function',
        r'(\w+)\s*:\s*function\s*\('
        # Removed arrow function pattern as it catches legitimate object properties
    ]
    
    all_functions = []
    for pattern in function_patterns:
        functions = re.findall(pattern, content)
        all_functions.extend(functions)
    
    function_counts = defaultdict(int)
    for func_name in all_functions:
        function_counts[func_name] += 1
    
    duplicate_functions = {func_name: count for func_name, count in function_counts.items() if count > 1}
    
    if duplicate_functions:
        print("❌ CRITICAL: Duplicate function definitions found:")
        for func_name, count in duplicate_functions.items():
            print(f"   - {func_name}: {count} instances")
            issues['duplicate_functions'].append(f"{func_name}: {count} instances")
    else:
        print("✅ No duplicate function definitions found")
    
    # 3. Check for z-index conflicts
    print("\n3️⃣ CHECKING FOR Z-INDEX CONFLICTS...")
    z_index_pattern = r'z-index:\s*([^;]+)'
    z_indexes = re.findall(z_index_pattern, content)
    
    # Check for overlapping z-index ranges
    z_values = []
    for z in z_indexes:
        try:
            if 'var(' in z:
                # Extract variable name
                var_match = re.search(r'var\(--([^)]+)\)', z)
                if var_match:
                    z_values.append(var_match.group(1))
            else:
                z_values.append(z.strip())
        except:
            pass
    
    # Check for potential conflicts in z-index variables
    z_conflicts = []
    z_vars = [z for z in z_values if 'z-' in z]
    if len(set(z_vars)) != len(z_vars):
        z_conflicts.append("Potential z-index variable conflicts")
    
    if z_conflicts:
        print("⚠️  Z-index conflicts detected:")
        for conflict in z_conflicts:
            print(f"   - {conflict}")
            issues['z_layer_conflicts'].append(conflict)
    else:
        print("✅ No z-index conflicts detected")
    
    # 4. Check for structural issues
    print("\n4️⃣ CHECKING FOR STRUCTURAL ISSUES...")
    
    # Check for unclosed divs
    open_divs = content.count('<div')
    close_divs = content.count('</div>')
    if open_divs != close_divs:
        issues['structural_issues'].append(f"Unmatched div tags: {open_divs} open, {close_divs} close")
        print(f"❌ Unmatched div tags: {open_divs} open, {close_divs} close")
    
    # Check for nested app-wrapper issues
    app_wrapper_count = content.count('class="app-wrapper"')
    if app_wrapper_count > 1:
        issues['cross_wrapper_issues'].append(f"Multiple app-wrapper divs: {app_wrapper_count}")
        print(f"❌ Multiple app-wrapper divs: {app_wrapper_count}")
    
    # Check for view conflicts
    view_elements = re.findall(r'<div[^>]*class="[^"]*view[^"]*"[^>]*>', content)
    if len(view_elements) > 2:  # auth-view and dashboard-view
        issues['structural_issues'].append(f"Too many view elements: {len(view_elements)}")
        print(f"⚠️  Too many view elements: {len(view_elements)}")
    
    # 5. Check for overlay conflicts
    print("\n5️⃣ CHECKING FOR OVERLAY CONFLICTS...")
    
    # Check for multiple modals with same z-index
    modal_pattern = r'class="[^"]*modal[^"]*"'
    modals = re.findall(modal_pattern, content)
    if len(modals) > 10:  # Arbitrary threshold
        issues['overlay_conflicts'].append(f"Many modal elements: {len(modals)}")
        print(f"⚠️  Many modal elements: {len(modals)}")
    
    # Check for fixed positioning conflicts
    fixed_elements = re.findall(r'position:\s*fixed', content)
    if len(fixed_elements) > 5:
        issues['overlay_conflicts'].append(f"Many fixed elements: {len(fixed_elements)}")
        print(f"⚠️  Many fixed elements: {len(fixed_elements)}")
    
    # 6. Check for logical errors
    print("\n6️⃣ CHECKING FOR LOGICAL ERRORS...")
    
    # Check for onclick handlers that might not exist
    onclick_pattern = r'onclick="([^"]+)"'
    onclick_handlers = re.findall(onclick_pattern, content)
    
    # Check for common patterns that might be problematic
    problematic_handlers = []
    for handler in onclick_handlers:
        if 'app.' in handler and not re.search(r'app\.\w+\.\w+', handler):
            problematic_handlers.append(handler)
    
    if problematic_handlers:
        issues['logical_errors'].append(f"Potentially problematic onclick handlers: {len(problematic_handlers)}")
        print(f"⚠️  Potentially problematic onclick handlers: {len(problematic_handlers)}")
    
    # 7. Check for cross-wrapper issues
    print("\n7️⃣ CHECKING FOR CROSS-WRAPPER ISSUES...")
    
    # Check for multiple container divs
    container_count = content.count('class="container"')
    if container_count > 1:
        issues['cross_wrapper_issues'].append(f"Multiple container divs: {container_count}")
        print(f"⚠️  Multiple container divs: {container_count}")
    
    # Check for conflicting CSS variables
    css_var_pattern = r'--([^:]+):'
    css_vars = re.findall(css_var_pattern, content)
    css_var_counts = defaultdict(int)
    for var in css_vars:
        css_var_counts[var] += 1
    
    duplicate_css_vars = {var: count for var, count in css_var_counts.items() if count > 1}
    if duplicate_css_vars:
        issues['cross_wrapper_issues'].append(f"Duplicate CSS variables: {len(duplicate_css_vars)}")
        print(f"⚠️  Duplicate CSS variables: {len(duplicate_css_vars)}")
    
    # 8. Generate summary report
    print("\n" + "=" * 60)
    print("📊 SUMMARY REPORT")
    print("=" * 60)
    
    total_issues = sum(len(issue_list) for issue_list in issues.values())
    
    if total_issues == 0:
        print("🎉 No critical issues found!")
    else:
        print(f"❌ Found {total_issues} issues:")
        
        for category, issue_list in issues.items():
            if issue_list:
                print(f"\n{category.replace('_', ' ').title()}:")
                for issue in issue_list:
                    print(f"  - {issue}")
    
    # 9. Recommendations
    print("\n" + "=" * 60)
    print("🔧 RECOMMENDATIONS")
    print("=" * 60)
    
    if issues['duplicate_ids']:
        print("1. CRITICAL: Remove duplicate IDs - each ID must be unique")
        print("   - Check treasure-chest, toggle switches, and other elements")
    
    if issues['duplicate_functions']:
        print("2. CRITICAL: Remove duplicate function definitions")
        print("   - Consolidate or rename duplicate functions")
    
    if issues['structural_issues']:
        print("3. HIGH: Fix structural issues")
        print("   - Ensure proper div nesting and closing")
        print("   - Remove duplicate view elements")
    
    if issues['cross_wrapper_issues']:
        print("4. MEDIUM: Resolve cross-wrapper conflicts")
        print("   - Consolidate container divs")
        print("   - Remove duplicate CSS variables")
    
    if issues['overlay_conflicts']:
        print("5. MEDIUM: Fix overlay conflicts")
        print("   - Review z-index hierarchy")
        print("   - Consolidate modal structures")
    
    print("\n6. GENERAL: Consider refactoring into separate files")
    print("   - Split CSS into separate stylesheet")
    print("   - Split JavaScript into modules")
    print("   - Use proper component structure")
    
    return issues

if __name__ == "__main__":
    analyze_app_structure()
